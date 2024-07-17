from decimal import Decimal, ROUND_HALF_UP

import loguru
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.photo.api.v1.serializers import PhotoLineSerializer, PhotoRetrieveSerializer

from apps.order.api.v1.serializers import OrderSerializer, PhotoCartSerializer, PhotoCartRemoveSerializer, PhotoLineCartSerializer
from apps.order.models import Order
from apps.photo.models import Photo, PhotoLine
from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.promocode.models.bonus_coupon import BonusCoupon


from apps.utils.services import CartService
from apps.utils.services.order_service import OrderService


class OrderAPIView(APIView):
    """Представление для заказа."""

    @swagger_auto_schema(responses={
        "201": openapi.Response(
            description=""
            )
        })
    def post(self, request):
        """Создание заказа из товаров корзины."""

        cart = CartService(request)
        order_service = OrderService(request=request, cart=cart)

        user = request.user
        photos, bonus_coupon, promocode = order_service.prepare_the_order_data()

        orders = order_service.create_orders()
        order_service.create_order_items(orders, photos, bonus_coupon, promocode)
        cart.remove_cart(user)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @staticmethod
    def get(request):
        """Получение списка заказов пользователя."""
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderOneAPIView(APIView):
    """Представление для одного заказа."""
    @staticmethod
    def get(request, pk):
        """Получение заказа."""
        order = get_object_or_404(Order, id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class PhotoCartAPIView(APIView):
    """Представление для одного фото из корзины (тестовый)"""
    @staticmethod
    def get(request):
        photo = get_object_or_404(Photo, id=request.data['id'])
        serializer = PhotoCartSerializer(photo)
        serializer.update(Photo, {'photo_type': request.data['photo_type']})
        return Response(serializer.data)


class CartAPIView(APIView):
    """Представление для корзины"""
    def post(self, request):
        """Добавление в корзину списка фотолиний"""
        # принимаем данные
        serializer = PhotoLineCartSerializer(request.data, many=True)
        response = serializer.data

        # инициируем корзину в сессии
        cart = CartService(request)
        user = request.user

        # есть ли промокоды
        promocode = user.promocode

        # есть ли купоны
        bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()

        for photo_line in serializer.data:
            # достаем фото из request считаем стоимоcть фотолинии без скидок
            photos = photo_line['photos']
            total_price = Decimal(0)

            # если промокоды есть - применить к цене
            for photo in photos:
                photo_type = photo['photo_type']

                # применить промокод и посчитать discount_price
                if promocode:
                    photo['discount_price'] = promocode.use_promocode_to_price(Decimal(photo['price_per_piece']).quantize(Decimal("0.0"), rounding=ROUND_HALF_UP), photo_type)
                    loguru.logger.info(photo['discount_price'])
                else:
                    photo['discount_price'] = Decimal(photo['price_per_piece']).quantize(Decimal("0.0"), rounding=ROUND_HALF_UP)
                    loguru.logger.info(photo['discount_price'])
                price = Decimal(photo['discount_price']).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP) * photo['quantity']
                loguru.logger.info(price)
                total_price += price

            # превышается ли сумма выкупа
            photo_line_obj = get_object_or_404(PhotoLine, id=photo_line['id'])
            ransom_amount = photo_line_obj.kindergarten.region.ransom_amount
            is_more_ransom_amount = total_price >= ransom_amount

            # будут ли электронные фото
            if is_more_ransom_amount:
                photo_line.update({'is_digital': True})


            # при необходимости прибавить стоимость электронных фото
            if not is_more_ransom_amount and photo_line['is_digital']:
                region = get_object_or_404(PhotoLine, id=photo_line['id']).kindergarten.region
                digital_price = get_object_or_404(PhotoPrice, region=region, photo_type=PhotoType.digital).price
                if promocode:
                    digital_price = promocode.use_promocode_to_price(Decimal(digital_price), photo_type=PhotoType.digital)
                total_price += Decimal(digital_price)

            # если есть купон - применить к цене
            if bonus_coupon:
                total_price = bonus_coupon.use_bonus_coupon_to_price(total_price)

            photo_line.update(
                {
                    'is_more_ransom_amount': is_more_ransom_amount,
                    'total_price': str(total_price),
                }
            )
        serializer = PhotoLineCartSerializer(response, many=True)
        cart.add_photolines_to_cart(user, serializer.data)
        return Response(serializer.data)

    @staticmethod
    def get(request):
        """Показать корзину."""
        cart = CartService(request)
        cart_list = cart.get_cart_list(request.user)
        serializer = PhotoLineCartSerializer(cart_list, many=True)
        return Response(serializer.data)


class OldCartAPIView(APIView):
    """Представление для отображения корзины."""

    def post(self, request):
        """Добавление фотолиний в корзину."""
        cart = CartService(request)
        user = request.user
        serializer = PhotoCartSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        photo_list = serializer.data

        for photo in photo_list:
            photo_obj = get_object_or_404(Photo, id=photo['photo_id'])
            if photo_obj:
                kindergarten = photo_obj.photo_line.kindergarten
                price_per_piece = kindergarten.region.photo_prices.select_related(
                    'region'
                ).get(photo_type=photo['photo_type']).price
                photo.update({'price_per_piece': float(price_per_piece)}),
                photo.update({'kindergarten_id': str(kindergarten.id)}),
        cart.add_product_list_to_cart(user=user, product_list=photo_list)
        return Response(photo_list)

    @staticmethod
    def get(request):
        """Показать корзину."""
        cart = CartService(request)
        cart_list = cart.get_cart_list(request.user)
        serializer = PhotoCartSerializer(cart_list, many=True)
        return Response(serializer.data)

    @staticmethod
    @swagger_auto_schema(responses={"204": openapi.Response(description="")}, request_body=PhotoCartRemoveSerializer)
    def delete(request):
        cart = CartService(request)
        user = request.user

        serializer = PhotoCartRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart.remove_product_from_cart(
            user=user,
            product_id=serializer.data['photo_id'],
            photo_type=serializer.data['photo_type'],
        )
        return Response(serializer.data)
