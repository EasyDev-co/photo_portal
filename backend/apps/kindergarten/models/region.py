from django.core.validators import MinLengthValidator
from django.db import models

from apps.kindergarten.validators import validate_cyrillic_space_dash
from apps.utils.models_mixins.models_mixins import UUIDMixin


class Region(UUIDMixin):
    country = models.CharField(
        verbose_name="Страна",
        max_length=56,
        default='Россия'
    )
    name = models.CharField(
        max_length=56,
        verbose_name='Название региона',
        validators=[validate_cyrillic_space_dash, MinLengthValidator(2)],
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
        ordering = ['name']
