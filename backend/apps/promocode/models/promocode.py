from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from django.db import models


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
