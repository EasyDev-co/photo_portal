from django.db import models

from .season import Season
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from apps.kindergarten.models import Kindergarten


class PhotoTheme(UUIDMixin, TimeStampedMixin):
    name = models.CharField(
        max_length=255,
        verbose_name='Название'
    )
    kindergartens = models.ManyToManyField(
        Kindergarten,
        verbose_name="Детский сад",
        related_name="photo_themes",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(
        verbose_name='Активно'
    )
    date_start = models.DateTimeField(
        verbose_name='Дата начала'
    )
    date_end = models.DateTimeField(
        verbose_name='Дата окончания'
    )
    are_qrs_removed = models.BooleanField(
        verbose_name='Удалены ли QR коды',
        default=False
    )
    ransom_counted = models.BooleanField(
        verbose_name='Выкуп подсчитан',
        default=False
    )
    season = models.ForeignKey(
        Season,
        on_delete=models.PROTECT,
        verbose_name='Сезон',
        related_name='photo_themes',
        null=True,
        blank=True,
    )

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Фотосессия'
        verbose_name_plural = 'Фотосессии'
        ordering = ("-created",)


class PhotoPopularityStat(PhotoTheme):
    class Meta:
        proxy = True
        verbose_name = 'Статистика популярности фотографий'
        verbose_name_plural = 'Статистики популярности фотографий'
