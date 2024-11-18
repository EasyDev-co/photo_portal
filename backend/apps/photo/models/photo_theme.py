from django.core.exceptions import ValidationError
from django.db import models

from .season import Season
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from apps.kindergarten.models import Kindergarten


class PhotoTheme(UUIDMixin, TimeStampedMixin):
    name = models.CharField(
        max_length=255,
        verbose_name='Название'
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

    def clean(self):
        super().clean()

        if not self.date_start or not self.date_end:
            raise ValidationError("Оба поля 'Дата начала' и 'Дата окончания' должны быть заполнены.")

        if self.date_start >= self.date_end:
            raise ValidationError("Дата окончания фотосессии не может быть раньше даты начала.")


class PhotoPopularityStat(PhotoTheme):
    class Meta:
        proxy = True
        verbose_name = 'Статистика популярности фотографий'
        verbose_name_plural = 'Статистики популярности фотографий'
