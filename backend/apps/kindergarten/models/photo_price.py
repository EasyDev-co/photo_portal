from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin
from apps.kindergarten.models.region import Region


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
    digital = 0, 'Электронные фото'


class PhotoPrice(UUIDMixin):
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Цена',
    )
    region = models.ForeignKey(
        Region,
        on_delete=models.PROTECT,
        related_name='photo_prices',
        verbose_name='Регион'
    )
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        default=PhotoType.small_photo,
        verbose_name='Тип фотографии'
    )

    def __str__(self):
        return f'Фото ({self.photo_type}) {self.price}'

    class Meta:
        verbose_name = 'Цена фото'
        verbose_name_plural = 'Цены фото'
