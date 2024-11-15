from django.db import models

from apps.kindergarten.models import Kindergarten
from apps.photo.models import PhotoTheme


class Ransom(models.Model):
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.CASCADE,
        related_name="ransoms",
        verbose_name='Детский сад'
    )
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.PROTECT,
        verbose_name='Тема фотосессии',
        related_name='ransoms'
    )
    ransom_amount = models.PositiveSmallIntegerField(
        default=0,
        verbose_name='Сумма выкупа'
    )
    average_bill = models.DecimalField(
        default=0,
        decimal_places=2,
        max_digits=10,
        verbose_name='Средний чек',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'Сумма выкупа'
        verbose_name_plural = 'Суммы выкупов'
