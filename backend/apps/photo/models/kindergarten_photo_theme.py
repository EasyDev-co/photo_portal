from django.db import models
from django.db.models import Q

from apps.kindergarten.models import Kindergarten
from .photo_theme import PhotoTheme


class KindergartenPhotoTheme(models.Model):
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.CASCADE,
        verbose_name='Детский сад',
        related_name='kindergartenphototheme',
    )
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.CASCADE,
        verbose_name='Тема фото',
        related_name='kindergartenphototheme',
    )
    is_active = models.BooleanField(
        verbose_name='Активно',
        default=False
    )

    class Meta:
        verbose_name = "Связь Детский сад - Фотосессия"
        verbose_name_plural = "Связи Детские сады - Фотосессии"
        constraints = [
            models.UniqueConstraint(
                fields=['kindergarten'],
                condition=Q(is_active=True),
                name='unique_active_photo_theme_per_kindergarten'
            )
        ]
