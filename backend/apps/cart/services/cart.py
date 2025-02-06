from decimal import Decimal
from django.db import transaction
from django.contrib.auth import get_user_model

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.promocode.models import Promocode, BonusCoupon

User = get_user_model()

from loguru import logger


class CartService:
    """Сервис корзины"""

    @staticmethod
    def get_or_create_cart(user):
        """
        Получаем корзину пользователя: если их несколько – оставляем первую и удаляем остальные.
        Если корзины нет – создаём новую.
        """
        carts = Cart.objects.filter(user=user)
        if carts.count() > 1:
            carts.exclude(id=carts.first().id).delete()
        cart = carts.first()
        if not cart:
            cart = Cart.objects.create(user=user)
        return cart

    @staticmethod
    def clear_cart_photo_lines(cart):
        """
        Удаляем все позиции корзины.
        """
        cart.cart_photo_lines.all().delete()

    def create_cart_photo_line(self, cart, data, user):
        """
        Создаёт одну позицию корзины с выполнением всех расчётов.
        Если ни одна фотография не выбрана и не запрошены цифровые/фотокнига, удаляем корзину и не создаём позицию.
        """
        photos_in_cart_data = data.pop('photos', [])
        total_quantity = sum(item.get('quantity', 0) for item in photos_in_cart_data)
        if total_quantity == 0 and not data.get('is_digital') and not data.get('is_photobook'):
            cart.delete()
            return None

        promo_code_str = data.pop('promo_code', None)

        try:
            with transaction.atomic():
                # Создаём позицию корзины
                instance = CartPhotoLine.objects.create(cart=cart, **data)

                # Получаем данные региона и прайс-лист
                region, region_prices, ransom_amount_for_digital, ransom_amount_for_calendar = \
                    self._get_region_data(data['photo_line'])

                # Получаем промокод (если передан)
                promo_code = self._get_promo_code(user, promo_code_str)

                # Получаем активный бонусный купон (если есть)
                bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()

                # Обрабатываем фотографии
                photo_instances, total_price = self._process_photo_items(photos_in_cart_data, region_prices,
                                                                         promo_code, instance)
                if photo_instances:
                    PhotoInCart.objects.bulk_create(photo_instances)

                # Добавляем стоимость фотокниги (если требуется)
                total_price = self._apply_photobook(data, region_prices, promo_code, user, total_price)

                # Обрабатываем цифровые фото
                total_price = self._apply_digital_price(data, region_prices, promo_code, total_price,
                                                        ransom_amount_for_digital, instance)

                # Применяем бесплатный календарь
                total_price = self._apply_free_calendar(total_price, ransom_amount_for_calendar, instance)

                # Применяем бонусный купон
                total_price = self._apply_bonus_coupon(user, bonus_coupon, total_price, cart)

                # Применяем скидку для менеджера
                total_price = self._apply_manager_discount(user, total_price)

                # Сохраняем итоговую стоимость и промокод
                instance.total_price = total_price

                cart.promocode = promo_code

                instance.save(update_fields=['total_price'])
                cart.save(update_fields=['promocode', 'order_fully_paid_by_coupon', 'bonus_coupon'])

                return instance
        except Exception as e:
            logger.error("Ошибка при сохранении данных корзины: %s", e)
            raise serializers.ValidationError('Не удалось сохранить данные.')

    @staticmethod
    def create_cart_photo_lines(cart, validated_data, request):
        """
        Принимает список валидированных данных и создаёт соответствующие позиции корзины.
        """
        created_instances = []
        user = request.user
        for data in validated_data:
            instance = CartService.create_cart_photo_line(cart, data, user)
            if instance is not None:
                created_instances.append(instance)
        return created_instances

    @staticmethod
    def _get_region_data(photo_line):
        """
        Извлекаем регион, прайс-лист и пороговые суммы для цифровых фото и календаря.
        """
        region = photo_line.kindergarten.region
        region_prices = PhotoPrice.objects.filter(region=region)
        ransom_amount_for_digital = region.ransom_amount_for_digital_photos
        ransom_amount_for_calendar = region.ransom_amount_for_calendar
        return region, region_prices, ransom_amount_for_digital, ransom_amount_for_calendar

    @staticmethod
    def _get_promo_code(user, promo_code_str):
        """
        Проверяем промокод и возвращаем его, либо генерируем ошибку.
        """
        if not promo_code_str:
            return None
        try:
            manager = user if user.role == User.role.manager else user.kindergarten.first().manager
            promo_code = Promocode.objects.get(code=promo_code_str, is_active=True, user=manager)
            return promo_code
        except Promocode.DoesNotExist:
            raise serializers.ValidationError('Неверный промокод.')

    @staticmethod
    def _process_photo_items(photos_in_cart_data, region_prices, promo_code, instance):
        """
        Обрабатываем список фотографий:
          – вычисляем цену за штуку с учётом промокода,
          – формируем объекты PhotoInCart,
          – суммируем итоговую стоимость.
        """
        total = Decimal(0)
        photo_instances = []
        for photo_data in photos_in_cart_data:
            quantity = photo_data.get('quantity', 0)
            if quantity == 0:
                continue
            price_per_piece = region_prices.get(photo_type=photo_data['photo_type']).price
            discount_price = price_per_piece
            if promo_code and promo_code.discount_services:
                discount_price = promo_code.apply_discount(price=price_per_piece)
            photo_instance = PhotoInCart(
                photo_type=photo_data['photo_type'],
                quantity=quantity,
                discount_price=discount_price,
                photo=photo_data.get('photo'),
                price_per_piece=price_per_piece,
                cart_photo_line=instance,
            )
            photo_instances.append(photo_instance)
            total += discount_price * quantity
        return photo_instances, total

    @staticmethod
    def _apply_photobook(data, region_prices, promo_code, user, total_price):
        """
        При наличии флага фотокниги – добавляем её стоимость.
        """
        if data.get('is_photobook'):
            if not user.kindergarten.first().has_photobook:
                raise serializers.ValidationError("Детский сад не имеет фотокниг")
            photobook_price = region_prices.get(photo_type=PhotoType.photobook).price
            if promo_code and promo_code.discount_photobooks:
                photobook_price = promo_code.apply_discount(price=photobook_price, is_photobook=True)
            total_price += photobook_price
        return total_price

    @staticmethod
    def _apply_digital_price(data, region_prices, promo_code, total_price, ransom_amount_for_digital, instance):
        """
        В зависимости от общего total_price и флага is_digital – либо предоставляем цифровые фото бесплатно,
        либо добавляем их стоимость.
        """
        if ransom_amount_for_digital:
            if not data.get('is_digital') and total_price >= ransom_amount_for_digital:
                instance.is_digital = True
                instance.is_free_digital = True
                instance.save(update_fields=['is_digital', 'is_free_digital'])
            elif data.get('is_digital') and total_price < ransom_amount_for_digital:
                digital_price = region_prices.get(photo_type=PhotoType.digital).price
                if promo_code and promo_code.discount_services:
                    digital_price = promo_code.apply_discount(price=digital_price)
                total_price += digital_price
        return total_price

    @staticmethod
    def _apply_free_calendar(total_price, ransom_amount_for_calendar, instance):
        """
        Если total_price превышает порог для календаря – отмечаем его как бесплатный.
        """
        if ransom_amount_for_calendar and total_price >= ransom_amount_for_calendar:
            instance.is_free_calendar = True
            instance.save(update_fields=['is_free_calendar'])
        return total_price

    @staticmethod
    def _apply_bonus_coupon(user, bonus_coupon, total_price, cart):
        """
        Применяем бонусный купон к total_price.
        """
        if bonus_coupon:
            initial_total = total_price
            total_price = bonus_coupon.use_bonus_coupon_to_price(total_price)
            if total_price == Decimal(1):
                cart.order_fully_paid_by_coupon = True
            else:
                cart.bonus_coupon = initial_total - total_price
        return total_price

    @staticmethod
    def _apply_manager_discount(user, total_price):
        """
        Применяем скидку для менеджера.
        """
        if user.role == User.role.manager:
            discount = user.manager_discount_balance
            if total_price > 0 and discount > 0:
                total_price = max(Decimal(0), total_price - discount)
        return total_price
