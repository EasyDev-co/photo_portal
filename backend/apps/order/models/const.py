from django.db import models


class OrderStatus(models.IntegerChoices):
    """Статус заказа."""
    created = 1, 'Создан'
    paid_for = 2, 'Оплачен'


class PhotoType(models.IntegerChoices):
    """Тип фото."""
    size_10x15 = 1, '10x15'
    size_15x20 = 2, '15x20'
    size_20x30 = 3, '20x30'
    magnet = 4, 'Магнит'
    calendar = 5, 'Календарь'
