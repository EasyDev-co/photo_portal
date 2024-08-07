from datetime import datetime

from django.core.exceptions import ValidationError
from pytz import timezone

from django.db import models
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten
from config.settings import TIME_ZONE
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

    def clean(self):
        super().clean()

        # проверяем срок фототемы
        current_time = datetime.now().astimezone(tz=timezone(TIME_ZONE))
        if self.photo_theme.date_end <= current_time:
            raise ValidationError('Срок указанной фототемы вышел.')

        # проверяем соответствует ли переданная фототема активной фототеме д/с
        if self.photo_theme.is_active:
            photo_themes = PhotoTheme.objects.filter(
                is_active=True,
                photo_lines__kindergarten=self.kindergarten
            ).distinct()

            if len(photo_themes) == 1 and photo_themes[0] != self.photo_theme or len(photo_themes) > 1:
                raise ValidationError('Активная тема фотосессии уже есть в этом детском саду.')
