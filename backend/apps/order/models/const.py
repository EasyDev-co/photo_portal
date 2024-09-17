from enum import StrEnum

from django.db import models


class OrderStatus(models.IntegerChoices):
    """Статус заказа."""
    created = 1, 'Создан'
    paid_for = 2, 'Оплачен'
    digital_order_is_completed = 3, 'Электронные фото готовы'
    completed = 4, 'Выполнен'
    payment_awaiting = 5, 'Ожидает оплаты'
    failed = 6, 'Платеж отклонен'
    refunded = 7, 'Платеж возвращен'


class PaymentStatus(StrEnum):
    CONFIRMED = 'CONFIRMED'
    CANCELED = 'CANCELED'
    DEADLINE_EXPIRED = 'DEADLINE_EXPIRED'
    REJECTED = 'REJECTED'
    AUTH_FAIL = 'AUTH_FAIL'


class PaymentMethod(StrEnum):
    """Способы оплаты для инициализации платежа и формирования чека."""
    FULL_PREPAYMENT = 'full_prepayment'
    FULL_PAYMENT = 'full_payment'
