from decimal import Decimal

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.cart.api.v2.serializers import (
    CartPhotoLineV2Serializer,
)
from apps.promocode.models import Promocode
from apps.user.models import UserRole
from apps.kindergarten.models import Kindergarten, PhotoType
from apps.photo.models import Photo, PhotoLine

from loguru import logger

User = get_user_model()

class DiscountMixin:

    @staticmethod
    def apply_kindergarten_manager_bonus(price, bonus, cart, user, quantity):
        """
        Применяет бонус менеджера к цене заказа и возвращает обновленную цену.

        Если цена и бонус положительные:
          - Если цена больше или равна бонусу, то заказ считается полностью оплаченным купоном
            и возвращается (price - bonus).
          - Если бонус больше цены, то заказ не считается полностью оплаченным купоном
            и возвращается 0.
        Если цена или бонус не положительные, возвращается исходная цена.
        """
        if price <= 0 or bonus <= 0:
            return price

        if price >= bonus:
            cart.order_fully_paid_by_coupon = True
            new_price = price - bonus
            user.manager_discount_balance = 0
        else:
            cart.order_fully_paid_by_coupon = False
            new_price = 1
            user.manager_discount_balance -= price * quantity

        user.save()
        cart.save()
        return new_price

    @staticmethod
    def get_promo_code(user, user_role, promo_code_data):
        if promo_code_data:
            manager = user if user_role == UserRole.manager else user.kindergarten.first().manager
            promo_code = Promocode.objects.filter(code=promo_code_data, is_active=True, user=manager).first()
            return promo_code
        return None

    @staticmethod
    def appy_discount(user, promo_code, price_per_piece):
        discount_price = price_per_piece
        if promo_code and promo_code.discount_services:
            discount_price = promo_code.apply_discount(
                price=price_per_piece
            )
            user.use_manager_coupon = True
            user.save()
        return discount_price

    @staticmethod
    def apply_manager_discount(price_per_piece):
        return price_per_piece / 2

class CartV2APIView(APIView, DiscountMixin):
    """
    Представление для работы с корзиной:
      - GET: возвращает позиции корзины текущего пользователя;
      - POST: обновляет корзину на основе переданных данных.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_photo_lines = CartPhotoLine.objects.filter(cart=cart)
        serializer = CartPhotoLineV2Serializer(cart_photo_lines, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        logger.info(f"data: {request.data}")

        request_data = request.data
        user = request.user
        user_role = request.user.role

        if user_role == UserRole.manager and not user.manager_discount_balance_empty:
            if user.manager_discount_balance > 0:
                user.manager_discount_balance = user.manager_discount_intermediate_balance
                user.save()

        logger.info(f"request data: {request.data}")

        if not request_data:
            return Response({"message": "Запрос пустой"}, status=status.HTTP_400_BAD_REQUEST)

        # Берём ID детского сада из первого элемента массива
        kindergarten_id = request_data[0].get("kindergarten_id")
        # Валидируем доступ к детскому саду
        kindergarten = self._validate_kindergarten(
            kindergarten_id=kindergarten_id,
            user=user,
            user_role=user_role,
        )
        if not kindergarten:
            return Response(
                {"message": "Регион или детский сад не валидны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Берём/создаём корзину
        cart = self._get_or_create_cart(user)
        # Удаляем предыдущие позиции, если они были
        cart_photo_lines_qs = cart.cart_photo_lines.select_related('cart')
        if cart_photo_lines_qs.exists():
            cart_photo_lines_qs.delete()

        # Получаем пороги сумм выкупа
        ransom_amounts = self._get_ransom_amount(kindergarten=kindergarten)
        # Получаем прайсы (цены по типам фото) для региона
        prices = self._get_prices(kindergarten=kindergarten)
        if not prices:
            return Response({"message": "Сумма не задана"}, status=status.HTTP_400_BAD_REQUEST)

        if not ransom_amounts:
            return Response({"message": "Суммы выкупа не заданы"}, status=status.HTTP_400_BAD_REQUEST)

        # Промокод (если есть)
        promo_code = self.get_promo_code(
            user=user,
            user_role=user_role,
            promo_code_data=request_data[0].get("promo_code")
        )

        cart_error = None
        if promo_code:
            if promo_code.activate_count <= 0:
                cart_error = "Попытки активации промокода исчерпаны"

        cart.promocode = promo_code

        # Карты, указывающие, для какого ребёнка какие пороги
        digital_thresholds = {
            1: "ransom_amount_for_digital_photos",
            2: "ransom_amount_for_digital_photos_second",
            3: "ransom_amount_for_digital_photos_third",
        }
        calendar_thresholds = {
            1: "ransom_amount_for_calendar",
            2: "ransom_amount_for_calendar_second",
            3: "ransom_amount_for_calendar_third",
        }

        # -----------------------------
        #   ПЕРВЫЙ ПРОХОД: считаем «грязные» цены
        # -----------------------------
        child_number = 0
        cart_photo_lines_list = []
        all_prices = Decimal(0)

        for data in request_data:
            logger.info(f"for_data: {data}")
            child_number += 1

            # 1) Создаём CartPhotoLine (строку корзины).
            #    Пока НЕ ставим is_free_digital / is_free_calendar.
            cart_photo_line = self._create_cart_photo_lines(
                cart=cart,
                kindergarten=kindergarten,
                user=user,
                data=data,
                child_number=child_number,
            )

            # 2) Считаем базовую стоимость данной строки
            total_price = self._update_photos_in_cart(
                cart_photo_line=cart_photo_line,
                photos_data=data.get("photos"),
                prices=prices,
                promo_code=promo_code,
                user_role=user_role,
                user=user,
                cart=cart,
            )
            logger.info(f"total_price (без учёта бесплатности): {total_price}")

            cart_photo_line.total_price = total_price
            cart_photo_line.save()

            cart_photo_lines_list.append(cart_photo_line)
            all_prices += total_price

        logger.info(f"Итоговая сумма по всем детям до бесплатностей: {all_prices}")

        # -----------------------------
        #   ВТОРОЙ ПРОХОД: проверяем пороги и даём «бесплатное»
        # -----------------------------
        # Здесь у нас несколько вариантов логики.
        # 1) Если хотим, чтобы «пробой» порога для N-го ребёнка означал,
        #    что и у 1-го ребёнка тоже бесплатная цифра, — значит,
        #    мы просто смотрим, что для каждого ребёнка свой ransom-ключ.
        #
        # 2) Если же у нас логика «один общий порог» на всех детей, то можно
        #    проверить один раз: if all_prices > X -> все дети с цифрой бесплатны.
        #
        # Ниже — пример, в котором "у каждого ребёнка свой порог".
        # И мы всё равно сначала смотрим на ВЕСЬ all_prices. Если он больше
        # порога соответствующего ребёнка — делаем для него is_free_digital.

        logger.info(f"start_with_all_price: {all_prices}")

        for cart_photo_line in cart_photo_lines_list:
            child_num = cart_photo_line.child_number

            digital_price = prices.get(PhotoType.digital.label) or Decimal(0)

            logger.info(f"------------------------------------------------child_num: {child_num}-------------------------------------------------")

            # Получаем ключи, соответствующие этому ребёнку
            digital_key = digital_thresholds.get(child_num)
            calendar_key = calendar_thresholds.get(child_num)

            # Проверяем «цифру»
            if digital_key:
                threshold_value = ransom_amounts.get(digital_key)

                logger.info(
                    f"BEFORE IF: child_num: {child_num} total_price:"
                    f" {cart_photo_line.total_price} threshold_value: {threshold_value}"
                )
                logger.info(f"all_price_without_digital_pirce: {all_prices - digital_price}")
                logger.info(f"test: {all_prices - digital_price >= threshold_value}")

                if user_role == UserRole.manager and user.manager_discount_balance <= 0:
                    digital_price = self.apply_manager_discount(digital_price)
                elif user_role == UserRole.parent and promo_code and promo_code.activate_count > 0:
                    digital_price = self.appy_discount(user, promo_code, digital_price)

                if cart_photo_line.is_digital:
                    all_prices -= digital_price

                cart_photo_line.all_price = all_prices

                if threshold_value and all_prices >= threshold_value:
                    # Значит, для этого ребёнка цифровые фото бесплатны
                    cart_photo_line.is_free_digital = True

                    logger.info(f"child_num: {child_num} total_price: {cart_photo_line.total_price}")
                    if cart_photo_line.total_price > 0 and cart_photo_line.is_digital:
                        cart_photo_line.digital_price = 0

                        new_total_price = cart_photo_line.total_price - digital_price
                        cart_photo_line.total_price = new_total_price

                        # all_prices -= digital_price

                    logger.info(
                        f"AFTER IF: child_num: {child_num}"
                        f" total_price: {cart_photo_line.total_price}"
                        f" threshold_value: {threshold_value}"
                    )
                    logger.info(f"all_price_after: {all_prices}")

            # Проверяем «календарь»
            if calendar_key:
                threshold_value = ransom_amounts.get(calendar_key)
                if threshold_value and all_prices >= threshold_value:
                    cart_photo_line.is_free_calendar = True

            # Сохраняем изменения строки
            logger.info(f"------------------------------------------------end child_num: {child_num}-------------------------------------------------")
            cart_photo_line.save()

        cart.save()
        # Возвращаем сериализованные данные
        return Response(
            CartPhotoLineV2Serializer(
                cart_photo_lines_list,
                many=True,
                context={"cart_error": cart_error}
            ).data,
            status=status.HTTP_200_OK
        )

    @staticmethod
    def _get_or_create_cart(user):
        cart = Cart.objects.filter(user=user).first()
        if not cart:
            cart = Cart.objects.create(user=user)
        return cart

    @staticmethod
    def _create_cart_photo_lines(cart, data, child_number, kindergarten, user):
        photo_line = PhotoLine.objects.filter(
            id=data.get("id")
        ).first()

        cart_photo_line = CartPhotoLine.objects.create(
            cart=cart,
            photo_line=photo_line,
            kindergarten=kindergarten,
            user=user,
            child_number=child_number,
            is_digital=data.get("is_digital"),
            is_photobook=data.get("is_photobook"),
        )
        return cart_photo_line

    def _update_photos_in_cart(
        self,
        cart_photo_line,
        photos_data,
        prices,
        promo_code,
        user_role,
        user,
        cart,
    ):
        total_price = Decimal(0)
        original_price = Decimal(0)

        photo_book_price = prices.get(PhotoType.photobook.label)
        digital_photo_price = prices.get(PhotoType.digital.label)

        item_count = 0

        if user_role == UserRole.manager:
            manager_bonus = User.objects.get(id=user.id).manager_discount_balance
        else:
            manager_bonus = None

        if cart_photo_line.is_photobook:
            item_count += 1

            discount_price_photo_book = photo_book_price

            if user_role == UserRole.manager and user.manager_discount_balance <= 0:
                discount_price_photo_book = self.apply_manager_discount(photo_book_price)
            elif user_role == UserRole.parent and promo_code and promo_code.activate_count > 0:
                discount_price_photo_book = self.appy_discount(user, promo_code, photo_book_price)

            if manager_bonus:
                discount_price_photo_book = self.apply_kindergarten_manager_bonus(
                    discount_price_photo_book,
                    manager_bonus,
                    cart,
                    user,
                    1,
                )
            cart_photo_line.photo_book_price = discount_price_photo_book

            total_price += discount_price_photo_book
            logger.info(f"photo_book_total_price: {total_price}")
            original_price += discount_price_photo_book

        if cart_photo_line.is_digital:
            item_count += 1

            discount_price_digital_photo = digital_photo_price

            logger.info(f"after_discount_price_digital_photo: {discount_price_digital_photo}")

            if user_role == UserRole.manager and user.manager_discount_balance <= 0:
                discount_price_digital_photo = self.apply_manager_discount(digital_photo_price)
            elif user_role == UserRole.parent and promo_code and promo_code.activate_count > 0:
                discount_price_digital_photo = self.appy_discount(user, promo_code, digital_photo_price)

            if manager_bonus:
                discount_price_digital_photo = self.apply_kindergarten_manager_bonus(
                    discount_price_digital_photo,
                    manager_bonus,
                    cart,
                    user,
                    1,
                )
            cart_photo_line.digital_price = discount_price_digital_photo

            total_price += discount_price_digital_photo
            logger.info(f"before_discount_price_digital_photo: {discount_price_digital_photo}")
            logger.info(f"digital_photo_total_price: {total_price}")
            original_price += discount_price_digital_photo

        for photo_info in photos_data:
            photo_uuid = photo_info.get("id")
            photo_type_int = photo_info.get("photo_type")
            quantity = photo_info.get("quantity", 0)

            if not photo_uuid or photo_type_int is None:
                continue

            photo_obj = Photo.objects.filter(id=photo_uuid).first()

            if not photo_obj:
                logger.info(f"error: photo not found: {photo_uuid}")
                photo_obj = None

            try:
                photo_type_label = PhotoType(photo_type_int).label
            except ValueError:
                logger.info(f"error: photo type: {photo_type_int}")
                continue

            price_per_piece = prices.get(photo_type_label)

            if not price_per_piece:
                continue

            if user_role == UserRole.manager:
                manager_bonus = User.objects.get(id=user.id).manager_discount_balance
                logger.info(f"in if manager_bonus: {manager_bonus}")
            else:
                manager_bonus = None

            if quantity > 0:
                item_count += 1

                discount_price = price_per_piece

                if user_role == UserRole.manager and user.manager_discount_balance <= 0:
                    discount_price = self.apply_manager_discount(price_per_piece)
                elif user_role == UserRole.parent and promo_code and promo_code.activate_count > 0:
                    discount_price = self.appy_discount(
                        user=user,
                        promo_code=promo_code,
                        price_per_piece=price_per_piece
                    )
                if manager_bonus:
                    logger.info(f"manager_bonus_before: {manager_bonus}-------------------------------------------------")
                    discount_price = self.apply_kindergarten_manager_bonus(
                        discount_price,
                        manager_bonus,
                        cart,
                        user,
                        quantity,
                    )
                    logger.info(f"discount_price_with_apply_manager_bonus: {discount_price}")
                    logger.info(f"manager_bonus_after: {manager_bonus}--------------------------------------------------")

                total_price += discount_price * quantity
                logger.info(f"photo_total_price: {total_price}")
                original_price += discount_price * quantity

                pic, created = PhotoInCart.objects.get_or_create(
                    cart_photo_line=cart_photo_line,
                    photo=photo_obj,
                    photo_type=photo_type_int,
                    defaults={
                        'quantity': quantity,
                        'price_per_piece': price_per_piece,
                        'discount_price': discount_price
                    }
                )
                if not created:
                    pic.quantity = quantity
                    pic.price_per_piece = price_per_piece
                    pic.save()
        logger.info(f"total_price_finaly: {total_price}")
        cart_photo_line.original_price = original_price
        cart_photo_line.total_price = total_price
        cart_photo_line.save()

        return total_price

    @staticmethod
    def _get_prices(kindergarten) -> dict:
        prices_by_type = {}
        region = kindergarten.region

        if not region:
            return prices_by_type
        for photo_type_value, photo_type_label in PhotoType.choices:
            price_instance = region.photo_prices.filter(photo_type=photo_type_value).first()
            prices_by_type[photo_type_label] = price_instance.price if price_instance else None
        return prices_by_type


    @staticmethod
    def _get_ransom_amount(kindergarten):
        region = kindergarten.region
        if not region:
            return {}

        prices = {}

        if region.ransom_amount_for_digital_photos is not None:
            prices['ransom_amount_for_digital_photos'] = region.ransom_amount_for_digital_photos

        if region.ransom_amount_for_calendar is not None:
            prices['ransom_amount_for_calendar'] = region.ransom_amount_for_calendar

        if region.ransom_amount_for_digital_photos_second is not None:
            prices['ransom_amount_for_digital_photos_second'] = region.ransom_amount_for_digital_photos_second

        if region.ransom_amount_for_calendar_second is not None:
            prices['ransom_amount_for_calendar_second'] = region.ransom_amount_for_calendar_second

        if region.ransom_amount_for_digital_photos_third is not None:
            prices['ransom_amount_for_digital_photos_third'] = region.ransom_amount_for_digital_photos_third

        if region.ransom_amount_for_calendar_third is not None:
            prices['ransom_amount_for_calendar_third'] = region.ransom_amount_for_calendar_third

        return prices


    @staticmethod
    def _validate_kindergarten(kindergarten_id, user, user_role):
        kindergarten = Kindergarten.objects.filter(id=kindergarten_id).first()

        if not kindergarten:
            return None

        if user_role == UserRole.parent:
            user_kindergarten = user.kindergarten.filter(id=kindergarten_id).exists()
        elif user_role == UserRole.manager:
            user_kindergarten = user.managed_kindergarten
        else:
            user_kindergarten = False

        if not user_kindergarten:
            return None

        return kindergarten
