from django.db import models
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten
from .photo_theme import PhotoTheme
from apps.utils.models_mixins.models_mixins import UUIDMixin

User = get_user_model()


class PhotoLine(UUIDMixin):
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.PROTECT,
        verbose_name='Тема фотосессии',
        related_name='photo_lines',
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.PROTECT,
        verbose_name='Детский сад',
        related_name='photo_lines',
    )
    qr_code = models.ImageField(
        upload_to='photo_line/',
        verbose_name="QR код",
        unique=True,
        null=True,
        blank=True
    )
    parent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        verbose_name='Родитель',
        related_name='photo_lines',
        blank=True,
        null=True,
    )

    def __str__(self):
        return f'{self.photo_theme} ({self.kindergarten})'

    class Meta:
        verbose_name = 'Линия фотографий'
        verbose_name_plural = 'Линии фотографий'
