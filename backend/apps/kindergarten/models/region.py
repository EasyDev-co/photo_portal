from django.db import models
from apps.utils.models_mixins.models_mixins import UUIDMixin


class Region(UUIDMixin):
    country = models.CharField(
        verbose_name="Страна",
        max_length=255,
        default='Россия'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Название региона',
        unique=True
    )
    ransom_amount = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'
