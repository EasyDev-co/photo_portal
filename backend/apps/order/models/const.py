from django.db import models


class OrderStatus(models.IntegerChoices):
    """Статус заказа."""
    created = 1, 'Создан'
    paid_for = 2, 'Оплачен'
    digital_order_is_comleted = 3, 'Электронные фото готовы'
    completed = 4, 'Выполнен'
