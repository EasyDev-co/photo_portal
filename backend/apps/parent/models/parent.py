from apps.utils.models_mixins.models_mixins import UUIDMixin
from django.db import models

from apps.kindergarten.models import Kindergarten

from apps.user.models import User


class Parent(UUIDMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent', verbose_name='Пользователь')
    kindergarten = models.ManyToManyField(Kindergarten, related_name='parents', verbose_name='Детский сад')

    def __str__(self):
        return f'Родитель {self.user}'

    class Meta:
        verbose_name = 'Родитель'
        verbose_name_plural = 'Родители'
