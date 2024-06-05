from django.db import models

from .region import Region
from apps.utils.models_mixins.models_mixins import UUIDMixin


class Kindergarten(UUIDMixin):
    region = models.ForeignKey(
        Region,
        on_delete=models.PROTECT,
        related_name='kindergartens',
        verbose_name='Регион'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Название'
    )
    code = models.CharField(
        max_length=255,
        verbose_name='Буквенный код',
        unique=True
    )
    qr_code = models.ImageField(
        upload_to='kindergarten/',
        verbose_name='QR код',
        unique=True,
        null=True,
        blank=True
    )
    has_photobook = models.BooleanField(
        default=False,
        verbose_name='Наличие фотокниги'
    )

    def __str__(self):
        return f'{self.name} ({self.code})'

    class Meta:
        verbose_name = 'Детский сад'
        verbose_name_plural = 'Детские сады'
