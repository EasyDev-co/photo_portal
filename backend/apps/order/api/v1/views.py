import loguru

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.order.api.v1.serializers import OrderSerializer, PhotoLineCartSerializer
from apps.order.models import Order
from apps.photo.models import PhotoLine

from apps.utils.services import CartService
from apps.utils.services.photo_line_cart_service import PhotoLineCartService
from apps.utils.services.order_service import OrderService

User = get_user_model()

class OrderAPIView(APIView):
    """Представление для заказа."""

    @swagger_auto_schema(responses={
        "201": openapi.Response(
            description=""
            )
        })
    def post(self, request):
        """Создание заказа из товаров корзины."""

        cart_service = CartService(request)
        # order_service = OrderService(request=request, cart=cart_service)
        user = request.user
        cart = cart_service.gef_cart_by_user_id(user)

        # предварительно создаем заказы
        orders = [
            Order(
                user=request.user,
                photo_line=get_object_or_404(PhotoLine, id=photo_line['id']),
                is_digital=photo_line['is_digital'],
                is_photobook=photo_line['is_photobook'],
                order_price=photo_line['total_price'],
            ) for photo_line in cart
        ]
        orders = Order.objects.bulk_create(orders)
        cart_service.remove_cart(user)

        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)
        loguru.logger.info(orders)

        return Response(cart)
        #
        # photos, bonus_coupon, promocode = order_service.prepare_the_order_data()
        #
        # orders = order_service.create_orders()
        # order_service.create_order_items(orders, photos, bonus_coupon, promocode)
        # cart_service.remove_cart(user)
        #
        # serializer = OrderSerializer(orders, many=True)
        # return Response(serializer.data)

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


class CartAPIView(APIView):
    """Представление для корзины"""
    def post(self, request):
        """Добавление в корзину списка фотолиний"""
        serializer = PhotoLineCartSerializer(request.data, many=True)
        response = serializer.data.copy()

        cart_service = CartService(request)
        user = request.user

        photo_line_cart_service = PhotoLineCartService(user, serializer)
        photo_line_cart_service.calculate_the_cost()

        serializer = PhotoLineCartSerializer(response, many=True)
        cart_service.add_products_to_cart(user, serializer.data)

        return Response(serializer.data)

    @staticmethod
    def get(request):
        """Показать корзину."""
        cart = CartService(request)
        cart_list = cart.get_cart_list(request.user)
        serializer = PhotoLineCartSerializer(cart_list, many=True)
        return Response(serializer.data)
