from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from django.db import models

from apps.kindergarten.models import PhotoType


class Promocode(UUIDMixin, TimeStampedMixin):
    """Модель промокода."""
    code = models.CharField(
        max_length=200,
        verbose_name="Промокод",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен",
    )

    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"

    def __str__(self):
        return f"Промокод {self.code}"


class PromocodePhotoTypes(UUIDMixin):
    """
    Модель для указания размера скидки для каждого типа фото.
    Если модели PromocodePhotoTypes для Promocode отсутствуют,
    то скидка применяется ко всем типам.
    """
    promocode = models.ForeignKey(
        Promocode,
        on_delete=models.CASCADE,
        related_name="promocode_phototype",
        verbose_name="Промокод",
    )
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        verbose_name="Тип фото, к которой применяется скидка",
        blank=True
    )
    discount = models.DecimalField(
        max_digits=3,
        decimal_places=0,
        verbose_name="Размер скидки (%)"
    )

    class Meta:
        verbose_name = "Скидка к промокоду"
        verbose_name_plural = "Скидки к промокодам"

    def __str__(self):
        return f"Скидка на {self.photo_type} к промокоду {self.promocode}"
