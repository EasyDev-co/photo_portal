from django.db import models

from .photo_line import PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin


class Photo(UUIDMixin):
    photo_line = models.ForeignKey(
        PhotoLine,
        on_delete=models.PROTECT,
        related_name='photos',
        verbose_name='Линия фотографий'
    )
    number = models.PositiveIntegerField(
        verbose_name='Номер',
        unique=True
    )
    photo = models.ImageField(
        upload_to='photo/',
        verbose_name='Фотография'
    )

    def __str__(self):
        return f'Фото №{self.number}'

    class Meta:
        verbose_name = 'Фотография'
        verbose_name_plural = 'Фотографии'
