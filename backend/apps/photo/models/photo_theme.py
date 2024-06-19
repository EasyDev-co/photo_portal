from django.db import models
from rest_framework.exceptions import ValidationError

from apps.kindergarten.models import Kindergarten
from apps.utils.models_mixins.models_mixins import UUIDMixin


class PhotoTheme(UUIDMixin):
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

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Тема фотосессии'
        verbose_name_plural = 'Темы фотосессий'
