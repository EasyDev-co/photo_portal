from decimal import Decimal

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
        serializer = PhotoLineCartSerializer(request.data)
        response = serializer.data

        # достаем фото из request считаем стоимоcть фотолинии без скидок
        photos = serializer.data['photos']
        total_price = Decimal(0)

        # есть ли промокоды
        promocode = request.user.promocode

        # если есть - применить к цене

        for photo in photos:
            photo_type = photo['photo_type']

            # применить промокод

            if promocode:
                photo['discount_price'] = promocode.use_promocode_to_price(photo['price_per_piece'], photo_type)
            else:
                photo['discount_price'] = photo['price_per_piece']
            price = photo['discount_price'] * photo['quantity']
            total_price += price

        # превышается ли сумма выкупа
        photo_line = get_object_or_404(PhotoLine, id=serializer.data['id'])
        ransom_amount = photo_line.kindergarten.region.ransom_amount
        is_more_ransom_amount = total_price >= ransom_amount

        # будут ли электронные фото
        if is_more_ransom_amount:
            response.update({'is_digital': True})

        if not is_more_ransom_amount and response['is_digital']:
            region = get_object_or_404(PhotoLine, id=response['id']).kindergarten.region
            digital_price = get_object_or_404(PhotoPrice, region=region, photo_type=PhotoType.digital).price
            if promocode:
                digital_price = promocode.use_promocode_to_price(digital_price, photo_type=PhotoType.digital)
            total_price += digital_price

        # есть ли купоны
        bonus_coupon = BonusCoupon.objects.filter(user=request.user, is_active=True, balance__gt=0).first()

        # если есть - применить к цене
        if bonus_coupon:
            total_price = bonus_coupon.use_bonus_coupon_to_price(total_price)

        response.update(
            {
                'total_price': total_price,
                'is_more_ransom_amount': is_more_ransom_amount,
            }
        )

        return Response(response)


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
