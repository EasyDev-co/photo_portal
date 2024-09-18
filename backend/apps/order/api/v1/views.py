from decimal import Decimal

import requests
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from requests import JSONDecodeError
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.kindergarten.models import PhotoType
from apps.order.api.v1.serializers import (
    OrderSerializer,
    PhotoLineCartSerializer,
    OrdersPaymentSerializer,
)
from apps.order.models import Order, OrderItem, OrdersPayment
from apps.order.models.const import OrderStatus, PaymentMethod
from apps.order.models.notification import NotificationFiscalization
from apps.order.permissions import IsOwner
from apps.order.tasks import parse_notification_fiscalization
from apps.photo.api.v1.serializers import PaidPhotoLineSerializer
from apps.photo.models import PhotoLine

from apps.utils.services import CartService
from apps.utils.services.calculate_price_for_order_item import calculate_price_for_order_item
from apps.utils.services.generate_token_for_t_bank import generate_token_for_t_bank
from apps.utils.services.photo_line_cart_service import PhotoLineCartService
from apps.utils.services.order_service import OrderService
from config.settings import (
    TERMINAL_KEY,
    PAYMENT_INIT_URL,
    PAYMENT_GET_STATE_URL,
    TAXATION,
    VAT,
    FFD_VERSION,
    PAYMENT_OBJECT,
    MEASUREMENT_UNIT
)

User = get_user_model()


class OrderAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        paid_photo_lines = PhotoLine.objects.select_related('orders').filter(
            orders__user=request.user,
            orders__status__in=(OrderStatus.paid_for, OrderStatus.completed),
            orders__is_digital=True
        )
        if paid_photo_lines.exists():
            serializer = PaidPhotoLineSerializer(paid_photo_lines, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        user = request.user
        orders_payment = OrdersPayment.objects.create()
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
                order_payment=orders_payment,
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

        orders_payment.amount = sum(order.order_price for order in orders)
        orders_payment.save()

        serializer = OrdersPaymentSerializer(orders_payment)
        cart_photo_lines.delete()

        return Response(serializer.data)


class PaymentAPIView(APIView):
    description = 'Выкуп фотографий'

    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user
        orders_payment = get_object_or_404(OrdersPayment, id=pk)
        orders = orders_payment.orders.all()
        order_items = OrderItem.objects.filter(order_id__in=orders.values_list('id', flat=True))

        payment_data = {
            'Amount': int(orders_payment.amount * 100),
            'Description': self.description,
            'OrderId': str(orders_payment.id),
            'TerminalKey': TERMINAL_KEY,
        }

        token = generate_token_for_t_bank(payment_data)
        payment_data['Receipt'] = {
            'Items': [
                {
                    'Name': f'{str(order_item.photo) + ", " if order_item.photo else ""}'
                            f'{PhotoType(order_item.photo_type).label}',
                    'Price': str(int(order_item.price * 100)),
                    'Quantity': str(order_item.amount),
                    'Amount': str(int(order_item.price * 100)),
                    'Tax': VAT,
                    'PaymentMethod': str(PaymentMethod.FULL_PREPAYMENT),
                    'PaymentObject': PAYMENT_OBJECT,
                    'MeasurementUnit': MEASUREMENT_UNIT
                } for order_item in order_items
            ],
            'FfdVersion': FFD_VERSION,
            'Email': str(user.email),
            'Taxation': TAXATION,
        }
        payment_data['Token'] = token
        response = requests.post(
            url=PAYMENT_INIT_URL,
            json=payment_data
        )
        try:
            if response.json()['Success']:
                payment_url = response.json()['PaymentURL']
                orders.update(
                    payment_id=response.json()['PaymentId'],
                    status=OrderStatus.payment_awaiting
                )
                return Response(payment_url, status=status.HTTP_200_OK)
            return Response(
                f"{response.json()['Message']} {response.json()['Details']}",
                status=status.HTTP_400_BAD_REQUEST
            )
        except JSONDecodeError as e:
            return Response(f"Ошибка {e}", status=response.status_code)


class GetPaymentStateAPIView(APIView):

    def get(self, request, pk):
        order = get_object_or_404(Order, id=pk)
        values = {
            'TerminalKey': TERMINAL_KEY,
            'PaymentId': order.payment_id,
        }
        token = generate_token_for_t_bank(values)
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


class OrdersPaymentAPIView(APIView):
    """
    Вью для просмотра заказов перед оплатой и удаления заказов.
    """
    permission_classes = (IsAuthenticated, IsOwner)

    def get_object(self, pk):
        obj = get_object_or_404(OrdersPayment, id=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk):
        serializer = OrdersPaymentSerializer(self.get_object(pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        self.get_object(pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationFiscalizationAPIView(APIView):
    """Вью для получения нотификации о фискализации от т-банка."""

    def post(self, request):
        try:
            # проверяем, что в запросе пришел json
            if not isinstance(request.data, dict):
                raise ValidationError(detail='Невалидные данные.', code='invalid_request_data')

            # создаем объект NotificationFiscalization с данными из запроса
            notification_fiscalization = NotificationFiscalization.objects.create(
                notification=request.data,
            )

            # запускаем задачу для обработки нотификации, передавая id созданного объекта NotificationFiscalization
            parse_notification_fiscalization.delay(
                notification_fiscalization.id
            )
            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


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
