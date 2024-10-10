from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


class NotificationFiscalization(UUIDMixin, TimeStampedMixin):
    notification = models.JSONField()
    was_processed = models.BooleanField(
        default=False
    )

    class Meta:
        verbose_name = 'Нотификация о фискализации'
        verbose_name_plural = 'Нотификации о фискализации'
