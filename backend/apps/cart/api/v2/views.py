from decimal import Decimal

from django.shortcuts import get_object_or_404
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


class DiscountMixin:

    @staticmethod
    def apply_kindergarten_manager_bonus(total_price, user, cart):
        manager_discount = user.manager_discount_balance
        if total_price > 0 and manager_discount > 0:
            if total_price <= manager_discount:
                total_price = Decimal(1)
                cart.order_fully_paid_by_coupon = True
            else:
                total_price -= manager_discount
                cart.order_fully_paid_by_coupon = False
        return total_price


    @staticmethod
    def get_promo_code(user, user_role, promo_code_data):
        if promo_code_data:
            manager = user if user_role == UserRole.manager else user.kindergarten.first().manager
            promo_code = Promocode.objects.filter(code=promo_code_data, is_active=True, user=manager).first()
            return promo_code
        return None

    @staticmethod
    def appy_discount(promo_code, price_per_piece):
        discount_price = price_per_piece
        if promo_code and promo_code.discount_services:
            discount_price = promo_code.apply_discount(
                price=price_per_piece
            )
        return discount_price


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

            logger.info(f"------------------------------------------------child_num: {child_num}-------------------------------------------------")

            # Получаем ключи, соответствующие этому ребёнку
            digital_key = digital_thresholds.get(child_num)
            calendar_key = calendar_thresholds.get(child_num)

            # Проверяем «цифру»
            if digital_key:
                threshold_value = ransom_amounts.get(digital_key)

                logger.info(f"BEFORE IF: child_num: {child_num} total_price: {cart_photo_line.total_price} threshold_value: {threshold_value}")

                if threshold_value and all_prices >= threshold_value:
                    # Значит, для этого ребёнка цифровые фото бесплатны
                    cart_photo_line.is_free_digital = True

                    logger.info(f"child_num: {child_num} total_price: {cart_photo_line.total_price}")

                    # Нужно вычесть стоимость цифры из total_price
                    digital_price = prices.get(PhotoType.digital.label) or Decimal(0)

                    # Если есть промокод, учитываем скидку (как в вашем коде)
                    if promo_code:
                        digital_price = self.appy_discount(promo_code, digital_price)

                    if cart_photo_line.total_price > 0 and cart_photo_line.is_digital:
                        new_total_price = cart_photo_line.total_price - digital_price
                        cart_photo_line.total_price = new_total_price

                        all_prices -= digital_price

                    logger.info(f"AFTER IF: child_num: {child_num} total_price: {cart_photo_line.total_price} threshold_value: {threshold_value}")

            # Проверяем «календарь»
            if calendar_key:
                threshold_value = ransom_amounts.get(calendar_key)
                if threshold_value and all_prices >= threshold_value:
                    cart_photo_line.is_free_calendar = True

            # Сохраняем изменения строки
            logger.info(f"------------------------------------------------end child_num: {child_num}-------------------------------------------------")
            cart_photo_line.save()

        # Возвращаем сериализованные данные
        return Response(
            CartPhotoLineV2Serializer(cart_photo_lines_list, many=True).data,
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

        if cart_photo_line.is_photobook:
            discount_price_photo_book = self.appy_discount(promo_code, photo_book_price)
            total_price += discount_price_photo_book
            original_price += discount_price_photo_book

        if cart_photo_line.is_digital:
            discount_price_digital_photo = self.appy_discount(promo_code, digital_photo_price)
            total_price += discount_price_digital_photo
            original_price += discount_price_digital_photo

        for photo_info in photos_data:
            photo_uuid = photo_info.get("id")
            photo_type_int = photo_info.get("photo_type")
            quantity = photo_info.get("quantity", 0)

            if not photo_uuid or photo_type_int is None:
                continue

            photo_obj = Photo.objects.filter(id=photo_uuid).first()

            logger.info(f"photo_uuid: {photo_uuid}")
            logger.info(f"photo_obj: {photo_obj}")

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

            if quantity > 0:
                discount_price = self.appy_discount(
                    promo_code=promo_code,
                    price_per_piece=price_per_piece
                )
                total_price += discount_price * quantity
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
            else:
                PhotoInCart.objects.filter(
                    cart_photo_line=cart_photo_line,
                    photo=photo_obj,
                    photo_type=photo_type_int
                ).delete()

        if user_role == UserRole.manager:
            total_price = self.apply_kindergarten_manager_bonus(total_price, user, cart)

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

        if not user.kindergarten.filter(id=kindergarten_id).exists():
            return None

        return kindergarten
