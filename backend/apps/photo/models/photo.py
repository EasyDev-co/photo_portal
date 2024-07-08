from django.db import models

from .photo_line import PhotoLine

from apps.child.models import Child
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
    child = models.ForeignKey(
        Child,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='photos',
        verbose_name='Ребенок',
    )

    def __str__(self):
        return f'Фото №{self.number}'

    class Meta:
        verbose_name = 'Фотография'
        verbose_name_plural = 'Фотографии'
