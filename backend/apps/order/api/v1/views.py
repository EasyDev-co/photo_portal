from decimal import Decimal

import requests
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.kindergarten.models import PhotoType
from apps.order.api.v1.serializers import OrderSerializer, PhotoLineCartSerializer
from apps.order.models import Order, OrderItem
from apps.order.models.const import OrderStatus

from apps.utils.services import CartService
from apps.utils.services.calculate_price_for_order_item import calculate_price_for_order_item
from apps.utils.services.generate_token_for_t_bank import generate_token_for_t_bank
from apps.utils.services.photo_line_cart_service import PhotoLineCartService
from apps.utils.services.order_service import OrderService
from config.settings import (TERMINAL_KEY,
                             T_PASSWORD,
                             PAYMENT_INIT_URL,
                             PAYMENT_GET_STATE_URL,
                             TAXATION,
                             VAT)

User = get_user_model()


class OrderAPIView(APIView):

    def post(self, request):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        cart_photo_lines = cart.cart_photo_lines.select_related('cart')
        region = cart.photo_lines.first().kindergarten.region
        photo_prices = region.photo_prices.all()

        prices_dict = {}
        for photo_price in photo_prices:
            prices_dict[photo_price.photo_type] = photo_price.price

        orders = [
            Order(
                user=user,
                photo_line=cart_photo_line.photo_line,
                is_digital=cart_photo_line.is_digital,
                is_photobook=cart_photo_line.is_photobook,
                order_price=cart_photo_line.total_price,

            ) for cart_photo_line in cart_photo_lines
        ]
        orders = Order.objects.bulk_create(orders)

        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)
        order_items = []
        for cart_photo_line in cart_photo_lines:
            order = orders.get(photo_line__id=cart_photo_line.photo_line.id)
            photos_in_cart = cart_photo_line.photos_in_cart.select_related('cart_photo_line')
            order_items.extend(
                [
                    OrderItem(
                        photo_type=photo_in_cart.photo_type,
                        amount=photo_in_cart.quantity,
                        order=order,
                        photo=photo_in_cart.photo,
                    ) for photo_in_cart in photos_in_cart
                ]
            )

            # добавляем э/ф и фотокнигу как order_item, если они есть
            if order.is_digital:
                order_items.append(
                    OrderItem(
                        photo_type=PhotoType.digital,
                        order=order,
                    ))
            if order.is_photobook:
                order_items.append(
                    OrderItem(
                        photo_type=PhotoType.photobook,
                        order=order,
                    ))

        # пересчитываем стоимость позиции с учетом промокода и купона

        coupon_amount = [Decimal(cart.bonus_coupon) if cart.bonus_coupon else 0]
        for order_item in order_items:
            if cart.order_fully_paid_by_coupon:
                order_item.price = Decimal(0)
                continue
            calculate_price_for_order_item(
                order_item=order_item,
                prices_dict=prices_dict,
                ransom_amount=region.ransom_amount,
                promocode=cart.promocode,
                coupon_amount=coupon_amount
            )

        # сетим в последний order_item 1, тк сумма заказа не может быть равна 0
        if cart.order_fully_paid_by_coupon:
            order_items[-1].price = Decimal(1)

        OrderItem.objects.bulk_create(order_items)

        serializer = OrderSerializer(orders, many=True)
        cart_photo_lines.delete()
        return Response(serializer.data)


class PaymentAPIView(APIView):
    description = 'Выкуп фотографий'

    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user
        order = get_object_or_404(Order, id=pk)
        order_items = OrderItem.objects.filter(order_id=order.id)

        payment_data = {
            'Amount': int(order.order_price * 100),
            'Description': self.description,
            'OrderId': order.id,
            'Password': T_PASSWORD,
            'TerminalKey': TERMINAL_KEY,
        }

        token = generate_token_for_t_bank(payment_data)
        payment_data.pop('Password')
        payment_data['Receipt'] = {
            'Items': [
                {
                    'Name': f'{str(order_item.photo) + ", " if order_item.photo else ""}'
                            f'{PhotoType(order_item.photo_type).label}',
                    'Price': str(int(order_item.price * 100)),
                    'Quantity': str(order_item.amount),
                    'Amount': str(int(order_item.price * 100)),
                    'Tax': VAT
                } for order_item in order_items
            ],
            'Email': str(user.email),
            'Taxation': TAXATION,
        }
        payment_data['Token'] = token

        response = requests.post(
            url=PAYMENT_INIT_URL,
            json=payment_data
        )

        if response.json()['Success']:
            payment_url = response.json()['PaymentURL']
            Order.objects.filter(id=order.id).update(
                payment_id=response.json()['PaymentId'],
                status=OrderStatus.payment_awaiting
            )
            return Response(payment_url, status=status.HTTP_200_OK)
        return Response(
            f"{response.json()['Message']} {response.json()['Details']}",
            status=status.HTTP_400_BAD_REQUEST
        )


class GetPaymentStateAPIView(APIView):

    def get(self, request, pk):
        order = get_object_or_404(Order, id=pk)
        values = {
            'TerminalKey': TERMINAL_KEY,
            'PaymentId': order.payment_id,
            'Password': T_PASSWORD,
        }
        token = generate_token_for_t_bank(values)
        values.pop('Password')
        values['Token'] = token
        response = requests.post(
            url=PAYMENT_GET_STATE_URL,
            json=values
        )
        if response.json()['Success'] and response.json()['Status'] == 'CONFIRMED':
            Order.objects.filter(id=order.id).update(status=OrderStatus.paid_for)
            return Response(
                response.json()['Message'],
                status=status.HTTP_200_OK
            )

        Order.objects.filter(id=order.id).update(status=OrderStatus.failed)
        return Response(
            f"Заказ не оплачен.",
            status=status.HTTP_400_BAD_REQUEST
        )


class OldOrderAPIView(APIView):
    """Представление для заказа. (Старое - не актуально)."""

    @swagger_auto_schema(
        responses={"201": OrderSerializer(many=True)},
        operation_description="Передается с пустым телом запроса. Все данные берет сам из корзины.",
    )
    def post(self, request):
        """Создание заказа из товаров корзины."""

        cart_service = CartService(request)
        user = request.user
        order_service = OrderService(user, cart_service)

        orders = order_service.create_orders()
        order_service.create_order_items(orders)

        serializer = OrderSerializer(orders, many=True)
        cart_service.remove_cart(user)
        return Response(serializer.data)

    @swagger_auto_schema(responses={"200": OrderSerializer(many=True)}, )
    def get(self, request):
        """Получение списка заказов пользователя."""
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OldOrderOneAPIView(APIView):
    """Представление для одного заказа. (Старое - не актуально)."""

    @swagger_auto_schema(responses={"200": OrderSerializer()}, )
    def get(self, request, pk):
        """Получение заказа."""
        order = get_object_or_404(Order, id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class OldCartAPIView(APIView):
    """Представление для корзины (старая корзина - не актуально)"""

    @swagger_auto_schema(
        responses={
            "201": openapi.Response(
                description="Отправить в корзину список пробников с указаний внутри каждой фото, типа фото, количества"
            )
        },
        request_body=PhotoLineCartSerializer
    )
    def post(self, request):
        """Добавление в корзину списка пробников"""
        serializer = PhotoLineCartSerializer(request.data, many=True)
        response = serializer.data.copy()

        cart_service = CartService(request)
        user = request.user

        photo_line_cart_service = PhotoLineCartService(user, serializer)
        photo_line_cart_service.calculate_the_cost()

        serializer = PhotoLineCartSerializer(response, many=True)
        cart_service.add_products_to_cart(user, serializer.data)

        return Response(serializer.data)

    @swagger_auto_schema(responses={"200": PhotoLineCartSerializer(many=True)}, )
    def get(self, request):
        """Показать корзину."""
        cart = CartService(request)
        cart_list = cart.get_cart_list(request.user)
        serializer = PhotoLineCartSerializer(cart_list, many=True)
        return Response(serializer.data)
