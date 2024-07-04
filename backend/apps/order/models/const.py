from django.db import models


class OrderStatus(models.IntegerChoices):
    """Статус заказа."""
    created = 1, 'Создан'
    paid_for = 2, 'Оплачен'


class PhotoType(models.IntegerChoices):
    """
    Типы печатной продукции для фотографий.
    """
    small_photo = 1, '10x15'
    medium_photo = 2, '15x20'
    large_photo = 3, '20x30'
    magnet = 4, 'Магнит'
    calendar = 5, 'Календарь'
    photobook = 6, 'Фотокнига'
