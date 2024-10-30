from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


class Season(models.IntegerChoices):
    """ Сезоны """
    WINTER = 1, 'Зима'
    SPRING = 2, 'Весна'
    SUMMER = 3, 'Лето'
    AUTUMN = 4, 'Осень'


class PhotoTheme(UUIDMixin, TimeStampedMixin):
    name = models.CharField(
        max_length=255,
        verbose_name='Название'
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
    season = models.PositiveSmallIntegerField(
        choices=Season.choices,
        default=Season.WINTER,
        verbose_name='Сезон'
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
