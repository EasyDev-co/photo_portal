import loguru

from decimal import Decimal

from django.shortcuts import get_object_or_404, get_list_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.models import Kindergarten
from apps.order.api.v1.serializers import OrderSerializer, PhotoCartSerializer, PhotoCartRemoveSerializer
from apps.order.models import Order, OrderItem
from apps.photo.models import Photo
from apps.promocode.models import Promocode
from apps.promocode.models.bonus_coupon import BonusCoupon

from apps.utils.services import CartService


class OrderAPIView(APIView):
    """Представление для заказа."""

    @swagger_auto_schema(responses={
        "201": openapi.Response(
            description="Отправляется пустой POST-запрос. Нужные данные "
                        "подтягиваются из корзины, хранящейся в сессии"
            )
        })
    def post(self, request):
        """Создание заказа из товаров корзины."""

        # создаем объект сервиса управления корзиной
        cart = CartService(request)

        # подготавливаем нужные данные
        user = request.user
        kindergarten_ids = cart.get_kindergarten_ids(user)
        photo_ids = cart.get_photo_ids(user)

        # получаем нужные queryset'ы по подготовленным данным
        kindergartens = Kindergarten.objects.filter(id__in=kindergarten_ids)
        photos = Photo.objects.filter(id__in=photo_ids)

        # создаем Orders - для каждого детского сада отдельный order
        orders = [Order(user=user, kindergarten=kindergarten) for kindergarten in kindergartens]
        orders = Order.objects.bulk_create(orders)

        # bulk_create возвращает list, поэтому достаем queryset через objects.filter
        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)

        # создаем OrderItems и формируем цену заказа
        cart_list = cart.get_cart_list(user)
        order_items = []

        # проверяем, есть ли не пустые купоны или промокоды
        bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()
        promocode = user.promocode

        for position in cart_list:
            order = orders.get(kindergarten__id=position['kindergarten_id'])
            photo = photos.get(id=position['photo_id'])

            price = Decimal(position['price_per_piece'] * position['quantity'])
            if bonus_coupon:
                price = bonus_coupon.use_bonus_coupon_to_price(price)
            if promocode:
                price = promocode.use_promocode_to_price(price, photo_type=position['photo_type'])
            order.order_price += price
            order.save()

            order_items.append(
                OrderItem(
                    photo_type=position['photo_type'],
                    is_digital=position['is_digital'],
                    amount=position['quantity'],
                    order=order,
                    photo=photo,
                )
            )
        OrderItem.objects.bulk_create(order_items)

        # удаляем корзину из сессии
        cart.remove_cart(user)

        # сериализуем данные для ответа на POST-запрос
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
    """Представление для отображения корзины."""

    @swagger_auto_schema(responses={"201": openapi.Response(description="Принимает список (list) с данными фото")}, request_body=PhotoCartSerializer)
    def post(self, request):
        """Добавление фото в корзину."""
        cart = CartService(request)
        user = request.user
        serializer = PhotoCartSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        photo_list = serializer.data

        for photo in photo_list:
            photo_obj = get_object_or_404(Photo, id=photo['photo_id'])
            if photo_obj:
                kindergarten = photo_obj.photo_line.kindergarten
                loguru.logger.info(str(kindergarten.id))
                price_per_piece = kindergarten.region.photo_prices.select_related(
                    'region'
                ).get(photo_type=photo['photo_type']).price
                loguru.logger.info(float(price_per_piece))
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
