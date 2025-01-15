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
        verbose_name='Фотосессия',
        related_name='kindergartenphototheme',
    )
    is_active = models.BooleanField(
        verbose_name='Активно',
        default=False
    )
    ya_disk_link = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Ссылка на ЯДиск'
    )

    def __str__(self):
        return self.photo_theme.name

    class Meta:
        verbose_name = "Связь Детский сад - Фотосессия"
        verbose_name_plural = "Связи Детские сады - Фотосессии"
        constraints = [
            models.UniqueConstraint(
                fields=['kindergarten'],
                condition=Q(is_active=True),
                name='unique_active_photo_theme_per_kindergarten',
                violation_error_message='У детского сада не может быть более одной активной фототемы.'
            )
        ]
