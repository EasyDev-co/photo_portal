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
    ransom_amount_for_digital_photos = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для электронных фотографий',
        null=True,
        blank=True
    )
    ransom_amount_for_calendar = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для календаря',
        null=True,
        blank=True
    )

    ransom_amount_for_digital_photos_second = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для электронных фотографий второго ребенка',
        null=True,
        blank=True
    )
    ransom_amount_for_calendar_second = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для календаря второго ребенка',
        null=True,
        blank=True
    )

    ransom_amount_for_digital_photos_third = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для электронных фотографий третьего ребенка',
        null=True,
        blank=True
    )
    ransom_amount_for_calendar_third = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для календаря третьего ребенка',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'
        ordering = ['name']


class RegionPriceSettings(Region):
    """
    Прокси-модель для управления массовыми настройками (ransom, цены).
    Никакой новой таблицы в БД не создаётся, это "виртуальный" класс.
    """
    class Meta:
        proxy = True
        verbose_name = "Настройка цен и выкупа"
        verbose_name_plural = "Глобальные настройки цен"
