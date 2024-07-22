from django.db import models

from apps.kindergarten.models import PhotoType


class Coefficient(models.Model):
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        verbose_name='Тип фотографии'
    )
    coefficient = models.FloatField(
        verbose_name='Коэффициент'
    )

    def __str__(self):
        return str(self.coefficient)

    class Meta:
        verbose_name = 'Коэффициент популярности фотографий'
        verbose_name_plural = 'Коэффициенты популярности фотографий'
