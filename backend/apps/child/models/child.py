from django.db import models
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


class Child(UUIDMixin, TimeStampedMixin):
    first_name = models.CharField(
        max_length=200,
        verbose_name='Имя',
    )
    last_name = models.CharField(
        max_length=200,
        verbose_name='Фамилия',
    )
    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        related_name='childs',
        verbose_name='Родитель',
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.PROTECT,
        blank=True,
        related_name='childs',
        verbose_name='Детский сад',
    )

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    class Meta:
        verbose_name = 'Ребенок'
        verbose_name_plural = 'Дети'
