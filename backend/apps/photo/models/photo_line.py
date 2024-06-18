from django.db import models
from django.core.files.base import ContentFile

from apps.kindergarten.models import Kindergarten
from apps.utils.services import generate_qr_code
from .photo_theme import PhotoTheme
from apps.utils.models_mixins.models_mixins import UUIDMixin
from config.settings import PHOTO_LINE_URL


class PhotoLine(UUIDMixin):
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.PROTECT,
        verbose_name='Тема фотосессии',
        related_name='photo_lines',
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.PROTECT,
        verbose_name='Детский сад',
        related_name='photo_lines',
    )
    qr_code = models.ImageField(
        upload_to='photo_line/',
        verbose_name="QR код",
        unique=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return f'{self.photo_theme} ({self.kindergarten})'

    class Meta:
        verbose_name = 'Линия фотографий'
        verbose_name_plural = 'Линии фотографий'

    def save(self, *args, **kwargs):
        if not self.qr_code:
            qr_code, buffer = generate_qr_code(PHOTO_LINE_URL + str(self.id))
            self.qr_code.save(
                f'{str(self.photo_theme.name)}_qr.png',
                ContentFile(buffer.read())
            )
        super().save(*args, **kwargs)
