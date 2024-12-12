import traceback

from datetime import datetime, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo

import requests
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from unisender_go_api import SyncClient, SendRequest

from apps.kindergarten.models import PhotoType
from apps.order.const import message_is_calendar_free, message_is_digital_free, message_digital_photo
from apps.order.models import Order, NotificationFiscalization, OrdersPayment, OrderItem
from apps.order.models.const import OrderStatus, PaymentStatus, PaymentMethod
from apps.order.models.receipt import Receipt
from apps.utils.services.generate_token_for_t_bank import generate_token_for_t_bank
from apps.utils.services.parse_notification_to_get_receipt import ParseNotificationToGetReceipt
from apps.utils.services.ya_disk import create_file_dtos_from_order, get_yadisk_service
from config.celery import BaseTask, app
from config.settings import (
    TERMINAL_KEY,
    PAYMENT_GET_STATE_URL,
    SEND_CLOSING_RECEIPT_URL,
    VAT,
    PAYMENT_OBJECT,
    TAXATION,
    FFD_VERSION,
    GALLERY_URL,
)
from config.settings import UNISENER_TOKEN, FROM_EMAIL

from apps.photo.models import PhotoTheme
from apps.user.models.email_error_log import EmailErrorLog
from apps.user.models.user import UserRole

from loguru import logger

User = get_user_model()


class DigitalPhotosNotificationTask(BaseTask):
    """
    Задача отправления уведомления о готовности электронных фото.
    Срабатывает через signals.py при изменении статуса Order на paid_for.
    """
    name = 'digital_photos_notification'

    def process(self, user_id, *args, **kwargs):
        user = get_object_or_404(User, id=user_id)
        if user:
            html_message = f"""
                        <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                            <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
                                <h1 style="margin: 0;">ФотоДетство</h1>
                            </div>
                            <div style="background-color: #f9f9f9; padding: 30px; text-align: center;">
                                <p style="font-size: 18px; color: #333;">
                                   Ваши электронные фото готовы
                                </p>
                                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                                    Вы можете скачать электронные фото в личном кабинете.
                                </p>
                                <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                                    С уважением,<br>Администрация Фото-портала
                                </p>
                            </div>
                        </div>
                        """
            subject = f"Ваши электронные фото готовы."
            try:
                with SyncClient.setup(UNISENER_TOKEN):
                    request = SendRequest(
                        message={
                            "recipients": [{"email": user.email}],
                            "body": {
                                "html": html_message,
                            },
                            "subject": subject,
                            "from_email": FROM_EMAIL,
                        },
                    )
                    request.send()
            except Exception as e:
                self.on_failure(
                    exc=e,
                    task_id=self.request.id,
                    args=(),
                    kwargs={'user': user},
                    einfo=traceback.format_exc(),
                )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        EmailErrorLog.objects.create(
            message=str(exc),
            is_sent=False,
            user=kwargs['user'],
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)


class CheckPhotoThemeDeadlinesTask(BaseTask):
    """
    Периодическая задача, проверяет дедлайны всей фото-тем.
    """

    def process(self, *args, **kwargs):
        notification_period = timedelta(hours=24)
        time_now = datetime.now(tz=ZoneInfo('Europe/Moscow'))
        time_left_to_deadline = time_now + notification_period
        time_border_to_send_notification = time_left_to_deadline - timedelta(hours=2)
        photo_themes = PhotoTheme.objects.filter(
            kindergartenphototheme__is_active=True,
            date_end__lt=time_left_to_deadline,
            date_end__gt=time_border_to_send_notification
        )
        kindergartens = photo_themes.values_list('photo_lines__kindergarten', flat=True)
        users = User.objects.filter(kindergarten__in=kindergartens, role=UserRole.parent)
        recipients = [{"email": email} for email in users.values_list('email', flat=True)]
        if recipients:
            send_deadline_notification(recipients=recipients)


class SendDeadLineNotificationTask(BaseTask):
    """
    Задача для отправки уведомлений об истечении дедлайна фото-темы.
    """
    name = 'send_deadline_notification'

    def process(self, recipients, *args, **kwargs):
        subject = f"До истечения срока фото-темы осталось менее 24 часов."
        html_message = f"""
            <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
                    <h1 style="margin: 0;">ФотоДетство</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 30px; text-align: center;">
                    <p style="font-size: 18px; color: #333;">
                       Осталось менее 24 часов до завершения заказа.
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        После истечения срока Вы больше не сможете заказать фотографии.
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                        С уважением,<br>Администрация Фото-портала
                    </p>
                </div>
            </div>
            """

        try:
            with SyncClient.setup(UNISENER_TOKEN):
                request = SendRequest(
                    message={
                        "recipients": recipients,
                        "body": {
                            "html": html_message,
                        },
                        "subject": subject,
                        "from_email": FROM_EMAIL,
                    },
                )
                request.send()
        except Exception as e:
            users = User.objects.filter(email__in=recipients)
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={'users': users},
                einfo=traceback.format_exc(),
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        email_error_logs = [
            EmailErrorLog(
                message=str(exc),
                is_sent=False,
                user=user,
            ) for user in kwargs['users']
        ]
        EmailErrorLog.objects.bulk_create(email_error_logs)
        super().on_failure(exc, task_id, args, kwargs, einfo)


class CheckIfOrdersPaid(BaseTask):
    """
    Задача для проверки статуса платежей у заказов, которые ожидают оплаты.
    """

    def run(self, *args, **kwargs):
        awaiting_payment_orders = Order.objects.filter(
            status=OrderStatus.payment_awaiting
        )
        successful_payment_order_ids = []
        failed_payment_order_ids = []
        for order in awaiting_payment_orders:
            values = {
                'TerminalKey': TERMINAL_KEY,
                'PaymentId': order.payment_id,
            }
            token = generate_token_for_t_bank(values)
            values['Token'] = token
            try:
                response = requests.post(
                    url=PAYMENT_GET_STATE_URL,
                    json=values
                )
                response_json = response.json()
                if response_json['Success']:
                    if response_json['Status'] == PaymentStatus.CONFIRMED:
                        successful_payment_order_ids.append(order.id)
                    elif response_json['Status'] in (
                            PaymentStatus.CANCELED,
                            PaymentStatus.REJECTED,
                            PaymentStatus.DEADLINE_EXPIRED,
                            PaymentStatus.AUTH_FAIL
                    ):
                        failed_payment_order_ids.append(order.id)
                else:
                    raise ValueError(f"{response_json['Message']} {response_json['Details']}")
            except Exception as e:
                failed_payment_order_ids.append(order.id)
                self.on_failure(
                    exc=e,
                    task_id=self.request.id,
                    args=(),
                    kwargs={'order_id': order.id},
                    einfo=traceback.format_exc(),
                )
        # TODO изменить текст, отправлять только дедлайн
        Order.objects.filter(id__in=successful_payment_order_ids).update(status=OrderStatus.paid_for)
        orders = Order.objects.filter(id__in=successful_payment_order_ids).all()
        if len(orders) > 0:
            for order in orders:
                price = self.get_price(order)
                deadline = self.get_deadline(order)
                message = self.get_message(order, price, deadline)

                order_paid_notify.delay(email=order.user.email, message=message)

        # TODO Доработать
        # Вызов задачи для загрузки файлов на Яндекс Диск
        logger.info(f"successful_payment_order_ids: {successful_payment_order_ids}")
        upload_files_to_yadisk.delay(successful_payment_order_ids)

        Order.objects.filter(id__in=failed_payment_order_ids).update(status=OrderStatus.failed)

    @staticmethod
    def get_deadline(order):
        photo_line = order.photo_line
        if not photo_line:
            return "Ошибка получения даты"
        photo_theme = photo_line.photo_theme

        if not photo_theme or not photo_theme.date_end:
            return "Ошибка получения даты"

        deadline = photo_theme.date_end + timedelta(days=7)
        return deadline.strftime('%d.%m.%Y')

    @staticmethod
    def get_price(order):
        """
        Возвращает сумму выкупа для заказа в зависимости от его типа.
        """
        price = 0
        order_item_with_photo = order.order_items.filter(photo__isnull=False).first()
        if not order_item_with_photo:
            return price

        photo = order_item_with_photo.photo
        if not photo:
            return price

        photo_line = photo.photo_line
        if not photo_line:
            return price

        kindergarten = photo_line.kindergarten
        if not kindergarten:
            return price

        region = kindergarten.region
        if not region:
            return price
        if order.is_free_calendar:
            return region.ransom_amount_for_calendar or 0
        elif order.is_free_digital:
            return region.ransom_amount_for_digital_photos or 0
        return price

    @staticmethod
    def get_message(order, price, deadline):
        if order.is_free_calendar:
            return message_is_calendar_free.format(
                first_name=order.user.first_name,
                last_name=order.user.last_name,
                price=price,
                deadline=deadline,
                base_url=GALLERY_URL,
            )
        elif order.is_free_digital:
            return message_is_digital_free.format(
                first_name=order.user.first_name,
                last_name=order.user.last_name,
                price=price,
                deadline=deadline,
                base_url=GALLERY_URL,
            )
        elif order.is_digital:
            return message_digital_photo.format(
                first_name=order.user.first_name,
                last_name=order.user.last_name,
                deadline=deadline,
                base_url=GALLERY_URL,
            )


class DeleteExpiredOrders(BaseTask):
    """Крон для удаления заказов, которые находятся в статусе Создан >12 часов."""

    def run(self, *args, **kwargs):
        try:
            Order.objects.filter(
                status=OrderStatus.created,
                created__lte=timezone.now() - timezone.timedelta(hours=12)
            ).delete()
        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={},
                einfo=traceback.format_exc(),
            )


class ParseNotificationFiscalization(BaseTask):
    """Задача для парсинга нотификации о фискализации от т-банка."""

    def run(self, notification_id: UUID):
        try:
            notification = NotificationFiscalization.objects.get(id=notification_id)

            # обрабатываем нотификацию
            parsed_data = ParseNotificationToGetReceipt(
                notification.notification
            ).parse_notification()

            # достаем заказ по id, который пришел в нотификации
            orders_payment = OrdersPayment.objects.get(
                id=parsed_data['orders_payment_id']
            )

            with transaction.atomic():
                # создаем объект Receipt
                Receipt.objects.create(
                    receipt_url=parsed_data['receipt'],
                    user=orders_payment.orders.first().user,
                    kindergarten=orders_payment.orders.first().photo_line.kindergarten,
                    orders_payment=orders_payment,
                )

                # сохраняем запись об успешной обработке нотификации
                notification.was_processed = True
                notification.save()

        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={'notification_id': notification_id},
                einfo=traceback.format_exc(),
            )


class SendClosingReceiptsTask(BaseTask):
    """
    Отправка закрывающего чека, когда все заказы у orders_payment находятся в статусе выполнен.
    """

    def run(self, *args, **kwargs):
        try:
            # достаем OrdersPayment, у которых выполнены все заказы
            orders_payments = OrdersPayment.objects.filter(
                orders__status=OrderStatus.completed,
                is_closing_receipt_sent=False
            )
            for orders_payment in orders_payments:
                orders = orders_payment.orders.all()
                orders_items = OrderItem.objects.filter(
                    order__in=orders
                )
                payment_data = {
                    'PaymentId': orders.first().payment_id,
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
                            'PaymentMethod': str(PaymentMethod.FULL_PAYMENT),
                            'PaymentObject': PAYMENT_OBJECT
                        } for order_item in orders_items
                    ],
                    'Email': str(orders.first().user.email),
                    'Taxation': TAXATION,
                    'FfdVersion': FFD_VERSION,
                    'Payments': {
                        'AdvancePayment': int(orders_payment.amount * 100)
                    }
                }
                payment_data['Token'] = token
                response = requests.post(
                    url=SEND_CLOSING_RECEIPT_URL,
                    json=payment_data
                )
                if response.json()['Success'] and response.json()['ErrorCode'] == '0':
                    orders_payment.is_closing_receipt_sent = True
                    orders_payment.save()
                else:
                    raise Exception(response.json()['Message'])

        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={},
                einfo=traceback.format_exc(),
            )


yadisk_service = get_yadisk_service()


class UploadFilesToYaDiskTask(BaseTask):
    """ Задача для загрузки файлов на Яндекс Диск """

    def run(self, paid_order_ids, *args, **kwargs):
        if paid_order_ids:
            paid_orders = Order.objects.filter(id__in=paid_order_ids).all()
            files = []
            for paid_order in paid_orders:
                files.extend(create_file_dtos_from_order(paid_order))
            try:
                yadisk_service.upload(files)
            except Exception as e:
                self.on_failure(
                    exc=e,
                    task_id=self.request.id,
                    args=(),
                    kwargs={'paid_orders': paid_orders, 'files': files},
                    einfo=traceback.format_exc(),
                )


class OrderPaidNotificationTask(BaseTask):
    name = "order_paid_notification"

    def process(self, email, message, *args, **kwargs):
        logger.info("send_email")
        logger.info(f"message: {message}")
        try:
            with SyncClient.setup(UNISENER_TOKEN):
                logger.info("email_sending")
                request = SendRequest(
                    message={
                        "recipients": [
                            {"email": email},
                        ],
                        "body": {
                            "html": message,
                        },
                        "subject": "Спасибо за вашу покупку",
                        "from_email": FROM_EMAIL,
                    },
                )
                request.send()
                logger.info("email_sent")
        except Exception as e:
            logger.error(f"Error: {e}")


order_paid_notify = app.register_task(OrderPaidNotificationTask)
digital_photos_notification = app.register_task(DigitalPhotosNotificationTask)
app.register_task(CheckPhotoThemeDeadlinesTask)
send_deadline_notification = app.register_task(SendDeadLineNotificationTask)
app.register_task(CheckIfOrdersPaid)
app.register_task(DeleteExpiredOrders)
parse_notification_fiscalization = app.register_task(ParseNotificationFiscalization)
app.register_task(SendClosingReceiptsTask)
upload_files_to_yadisk = app.register_task(UploadFilesToYaDiskTask)
