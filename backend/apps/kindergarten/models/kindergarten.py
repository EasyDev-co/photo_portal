from django.core.files.base import ContentFile
from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin
from apps.kindergarten.models.region import Region
from apps.utils.services import generate_qr_code
from config.settings import REGISTRATION_URL_FOR_PARENT


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

    def save(self, *args, **kwargs):
        if not self.qr_code:
            qr_code, buffer = generate_qr_code(
                url=REGISTRATION_URL_FOR_PARENT,
                kindergarten_code=self.code
            )
            self.qr_code.save(
                f'{self.code}_qr.png',
                ContentFile(buffer.read())
            )
        super().save(*args, **kwargs)
