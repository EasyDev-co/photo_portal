import loguru

from decimal import Decimal

from django.shortcuts import get_object_or_404, get_list_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.models import Kindergarten
from apps.order.api.v1.serializers import OrderListSerializer
from apps.order.models import Order, OrderItem
from apps.photo.models import Photo

from apps.utils.services import CartService


class OrderAPIView(APIView):
    """Представление для заказа."""

    def post(self, request):
        """Создание заказа из корзины."""

        # создаем объект сервиса управления корзиной
        cart = CartService(request)

        # подготавливаем нужные данные
        user = request.user
        kindergarten_ids = cart.get_kindergarten_ids(user)
        photo_ids = cart.get_photo_ids(user)

        # получаем нужные queryset'ы
        kindergartens = Kindergarten.objects.filter(id__in=kindergarten_ids)
        photos = Photo.objects.filter(id__in=photo_ids)

        # создаем Orders
        orders = [Order(user=user, kindergarten=kindergarten) for kindergarten in kindergartens]
        orders = Order.objects.bulk_create(orders)

        # bulk_create возвращает list, поэтому достаем queryset через objects.filter
        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)

        # создаем OrderItems
        cart_list = cart.get_cart_list(user)
        order_items = []

        for position in cart_list:
            order = orders.get(kindergarten__id=position['kindergarten_id'])
            photo = photos.get(id=position['photo_id'])

            # т.к. разделение Orders по детским садам, никак не смог уйти от order.save() на каждой итерации цикла
            order.order_price += Decimal(position['price_per_piece'] * position['quantity'])
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

        # сериализуем данные для ответа на POST-запрос
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)


class PhotoCartAPIView(APIView):
    """Представление для отображения корзины."""

    @swagger_auto_schema(responses={"200": openapi.Response(description="")})
    def post(self, request):
        """Добавление фото в корзину."""
        cart = CartService(request)
        user = request.user
        photo = get_object_or_404(Photo, id=request.data['photo_id'])

        if photo:
            kindergarten = photo.photo_line.kindergarten
            price_per_piece = kindergarten.region.photo_prices.select_related(
                'region'
            ).get(photo_type=request.data['photo_type']).price

            photo_data = {
                'photo_id': str(photo.id),
                'photo_type': request.data['photo_type'],
                'is_digital': request.data['is_digital'],
                'quantity': request.data['quantity'],
                'price_per_piece': float(price_per_piece),
                'kindergarten_id': str(kindergarten.id)
            }

            cart.add_product_to_cart(user, photo_data)
            return Response({'message': f'Фото {photo.id} успешно добавлено в корзину'})

        return Response({'message': f'Фото не найдено в БД'})

    @staticmethod
    def get(request):
        """Показать корзину."""
        cart = CartService(request)
        cart_list = cart.get_cart_list(request.user)
        return Response(cart_list)

    @staticmethod
    def delete(request):
        cart = CartService(request)
        user = request.user
        cart.remove_product_from_cart(
            user=user,
            product_id=request.data['photo_id'],
            photo_type=request.data['photo_type'],
        )
        return Response({'message': 'Удалено'})
