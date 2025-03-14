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

from datetime import timedelta

from apps.cart.models import Cart
from apps.kindergarten.api.v1.permissions import IsManager
from apps.kindergarten.models import PhotoType
from apps.order.api.v1.serializers import (
    OrderSerializer,
    PhotoLineCartSerializer,
    OrdersPaymentSerializer,
    OrderManagerSerializer,
)
from apps.order.models import Order, OrderItem, OrdersPayment
from apps.order.models.const import OrderStatus, PaymentMethod
from apps.order.models.notification import NotificationFiscalization
from apps.order.permissions import IsOrdersPaymentOwner
from apps.photo.api.v1.serializers import PaidPhotoLineSerializer
from apps.photo.models import PhotoLine, PhotoTheme
from apps.user.models import UserRole
from apps.utils.models_mixins.models_mixins import logger

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
)

from django.utils.timezone import now
from django.db.models import F

User = get_user_model()

IS_DIGITAL = 0
IS_FREE_DIGITAL = 1


class OrderAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def aggregate_is_digital(photo_lines_queryset):
        """
        Формирует словари с уникальными PhotoLine и со значением is_digital и is_free_digital для каждого PhotoLine
        """
        photo_lines_dict = {}
        is_digital_by_photo_line_id = {}

        for photo_line in photo_lines_queryset:
            photo_line_id = photo_line.id

            if photo_line_id not in photo_lines_dict:
                photo_lines_dict[photo_line_id] = photo_line
                is_digital_by_photo_line_id[photo_line_id] = [
                    photo_line.is_digital,
                    photo_line.is_free_digital
                ]
            else:
                # обновляем, если is_digital=True и/или is_free_digital=True
                if photo_line.is_digital:
                    is_digital_by_photo_line_id[photo_line_id][0] = True  # IS_DIGITAL
                if photo_line.is_free_digital:
                    is_digital_by_photo_line_id[photo_line_id][1] = True # IS_FREE_DIGITAL

        logger.info(f"photo_lines_dict: {photo_lines_dict}")

        return photo_lines_dict, is_digital_by_photo_line_id

    @staticmethod
    def finalize_photo_lines(photo_lines_dict, is_digital_by_photo_line_id):
        """
        Формирует итоговый список объектов.
        """
        current_time = now()
        photo_lines = []

        for photo_line_id, photo_line in photo_lines_dict.items():
            # восстанавливаем is_digital и is_free_digital
            logger.info(f"photo_line_id: {photo_line_id}")
            logger.info(f"photo_line: {photo_line}")

            photo_line.is_digital, photo_line.is_free_digital = is_digital_by_photo_line_id[photo_line_id]

            extended_date_end = photo_line.photo_theme.date_end + timedelta(days=7)
            photo_line.is_date_end = extended_date_end < current_time

            photo_lines.append(photo_line)
        return photo_lines

    def get(self, request):
        user = request.user

        photo_lines_queryset = PhotoLine.objects.filter(
            kindergarten__in=user.kindergarten.all(),
            parent=user,
            orders__status=OrderStatus.paid_for
        ).annotate(
            is_digital=F('orders__is_digital'),
            is_free_digital=F('orders__is_free_digital'),
        ).order_by('id', 'photo_theme__date_end')

        if not photo_lines_queryset.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        photo_lines_dict, is_digital_by_photo_line_id = self.aggregate_is_digital(photo_lines_queryset)
        photo_lines = self.finalize_photo_lines(photo_lines_dict, is_digital_by_photo_line_id)

        if not photo_lines:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = PaidPhotoLineSerializer(photo_lines, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user

        # Создаём общий OrdersPayment (платёж)
        orders_payment = OrdersPayment.objects.create()

        # Достаём корзину пользователя
        cart = get_object_or_404(Cart, user=user)
        cart_photo_lines = cart.cart_photo_lines.select_related('cart')

        # Допустим, регион берём из первого photo_line'а (как было в вашем коде)
        region = cart.photo_lines.first().kindergarten.region
        photo_prices = region.photo_prices.all()

        # Готовим словарь цен по типам фото
        prices_dict = {}
        for photo_price in photo_prices:
            prices_dict[photo_price.photo_type] = photo_price.price

        logger.info(f"cart_photo_lines: {cart_photo_lines}")

        for cart_photo_line in cart_photo_lines:
            logger.info(f"photo_line: {cart_photo_line.photo_line}")

        # Создаём объекты Order на основе строк корзины
        orders = [
            Order(
                user=user,
                photo_line=cart_photo_line.photo_line,
                # Переносим флаги из корзины:
                is_digital=cart_photo_line.is_digital,
                is_free_digital=cart_photo_line.is_free_digital,
                is_photobook=cart_photo_line.is_photobook,
                is_free_calendar=cart_photo_line.is_free_calendar,
                # Берём цены из самой строки
                order_price=cart_photo_line.total_price,
                original_price=cart_photo_line.original_price,
                order_payment=orders_payment,
            )
            for cart_photo_line in cart_photo_lines
        ]
        orders = Order.objects.bulk_create(orders)

        # Собираем order_items
        order_ids = [order.id for order in orders]
        orders_map = {o.photo_line.id: o for o in Order.objects.filter(id__in=order_ids)}

        order_items = []
        for cart_photo_line in cart_photo_lines:
            order = orders_map[cart_photo_line.photo_line.id]

            # Берём все фото, которые выбрал пользователь
            photos_in_cart = cart_photo_line.photos_in_cart.select_related('cart_photo_line')
            order_items.extend(
                OrderItem(
                    photo_type=photo_in_cart.photo_type,
                    amount=photo_in_cart.quantity,
                    order=order,
                    photo=photo_in_cart.photo,
                    price=photo_in_cart.discount_price * photo_in_cart.quantity,
                )
                for photo_in_cart in photos_in_cart
            )

            # Если пользователь заказал «электронные фото» (is_digital), добавляем отдельный OrderItem
            if order.is_digital:
                order_items.append(
                    OrderItem(
                        photo_type=PhotoType.digital,
                        amount=1,  # обычно 1 позиция
                        order=order,
                    )
                )

            # Фотокнига (если была выбрана)
            if order.is_photobook:
                order_items.append(
                    OrderItem(
                        photo_type=PhotoType.photobook,
                        amount=1,
                        order=order,
                    )
                )

            # Бесплатный календарь
            if order.is_free_calendar:
                order_items.append(
                    OrderItem(
                        photo_type=PhotoType.free_calendar,
                        amount=1,
                        photo=cart_photo_line.photo_line.photos.order_by('?').first(),
                        order=order,
                    )
                )

        # Теперь пересчитываем стоимость каждого OrderItem, учитывая промокод, купон, и (ВНИМАНИЕ!) флаг is_free_digital
        coupon_amount = [Decimal(cart.bonus_coupon) if cart.bonus_coupon else Decimal(0)]

        for order_item in order_items:
            order_ref = order_item.order  # сам заказ

            # 1) Если для всего заказа (или корзины) стоит флаг "заказ полностью куплен купоном"
            if cart.order_fully_paid_by_coupon:
                order_item.price = Decimal(0)
                continue

            # 2) Если это цифровое фото, а у заказа проставлено is_free_digital=True – ставим 0
            if order_ref.is_free_digital and order_item.photo_type == PhotoType.digital:
                order_item.price = Decimal(0)
                continue

            if order_ref.is_free_calendar and order_item.photo_type == PhotoType.free_calendar:
                order_item.price = Decimal(0)
                continue

            # 3) Иначе – обычный расчёт цены
            # calculate_price_for_order_item(
            #     order_item=order_item,
            #     prices_dict=prices_dict,
            #     ransom_amount_for_digital_photos=region.ransom_amount_for_digital_photos,
            #     promocode=cart.promocode,
            #     coupon_amount=coupon_amount,
            #     user_role=user.role
            # )

        # Важно: если всё было оплачено купоном, вы где-то ставите price=1 на самый первый OrderItem
        # (чтобы сумма не была = 0; по логике вашей платёжной системы).
        # Оставим это, как есть у вас сейчас:
        if cart.order_fully_paid_by_coupon and order_items:
            order_items[0].price = Decimal(1)
                        
        # Промокод: увеличиваем счётчик активаций и записываем пользователя
        if cart.promocode:
            promocode = cart.promocode
            promocode.used_by = promocode.used_by or []
            promocode.used_by.append({'id': str(user.id), 'email': user.email})
            promocode.activate_count += 1
            promocode.save()

        # Сохраняем все OrderItem
        OrderItem.objects.bulk_create(order_items)

        # Обновляем сумму общего платёжного объекта
        orders_payment.amount = sum(order.order_price for order in orders)
        orders_payment.save()

        # Сериализуем и возвращаем
        serializer = OrdersPaymentSerializer(orders_payment)

        # Очищаем корзину
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
                    'Price': int(order_item.price * 100),
                    'Quantity': order_item.amount,
                    'Amount': int(order_item.price * 100),
                    'Tax': VAT,
                    'PaymentMethod': str(PaymentMethod.FULL_PREPAYMENT),
                    'PaymentObject': PAYMENT_OBJECT
                } for order_item in order_items
            ],
            'FfdVersion': FFD_VERSION,
            'Email': str(user.email),
            'Taxation': TAXATION,
        }

        logger.info(f"payment_data: {payment_data}")

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

                # обновляем баланс бонусного купона, после его использования
                total_original_price = sum(order.original_price for order in orders.all())
                # user.manager_discount_balance = max(user.manager_discount_balance - total_original_price, 0)
                if request.user.role == UserRole.manager:
                    discount_balance = user.manager_discount_balance
                    if discount_balance <= 0:
                        user.manager_discount_intermediate_balance = 0
                        user.manager_discount_balance_empty = True
                    else:
                        user.manager_discount_intermediate_balance = user.manager_discount_balance
                    user.save()

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
    permission_classes = (IsAuthenticated, IsOrdersPaymentOwner)

    def get_object(self, pk):
        obj = get_object_or_404(OrdersPayment, id=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk):
        serializer = OrdersPaymentSerializer(self.get_object(pk))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        instance = self.get_object(pk)
        orders_statuses = set(instance.orders.all().values_list('status', flat=True))
        # Все заказы в статусе "создан"
        if len(orders_statuses) == 1 and OrderStatus.created in orders_statuses:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # Все/некоторые заказы имеют статус отличный от "создан"
        return Response('Невозможно удалить заказ', status=status.HTTP_400_BAD_REQUEST)


class OrderManagerListAPIView(APIView):
    """Получение списка заказов с фильтрацией по статусу, photo_theme и kindergarten"""
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request, photo_theme_id, kindergarten_id):
        """
        Получение списка заказов для определенной фото темы и детского сада
        ---
        Args:
            request: запрос от клиента.
            photo_theme_id: ID фото темы, по которой нужно отфильтровать заказы.
            kindergarten_id: ID детского сада, по которому нужно отфильтровать заказы.

        Returns:
            Response: Список заказов с полями:
                - order_price
                - user.first_name
                - user.last_name
                - payment_id
        """
        try:
            if not PhotoTheme.objects.filter(id=photo_theme_id, photo_lines__kindergarten_id=kindergarten_id).exists():
                return Response(
                    {"error": "Photo theme for the specified kindergarten not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            orders = Order.objects.filter(
                status=OrderStatus.paid_for,
                photo_line__photo_theme_id=photo_theme_id,
                photo_line__kindergarten_id=kindergarten_id
            ).select_related('user', 'photo_line')

            serializer = OrderManagerSerializer(orders, many=True)

            return Response(
                {"orders": serializer.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
            # parse_notification_fiscalization.delay(
            #     notification_fiscalization.id
            # )
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
