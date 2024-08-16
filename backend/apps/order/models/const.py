from django.db import models


class OrderStatus(models.IntegerChoices):
    """Статус заказа."""
    created = 1, 'Создан'
    paid_for = 2, 'Оплачен'
    digital_order_is_completed = 3, 'Электронные фото готовы'
    completed = 4, 'Выполнен'
    refunded = 5, 'Платеж возвращен'
    rejected = 6, 'Платеж отклонен'
