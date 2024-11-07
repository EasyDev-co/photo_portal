from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


class Notification(UUIDMixin, TimeStampedMixin):
    """Модель уведомлений."""

    user = models.ForeignKey(
        User,
        related_name="notifications",
        on_delete=models.CASCADE,
        verbose_name="Получатель"
    )
    sender = models.ForeignKey(
        User,
        related_name="sent_notifications",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Отправитель"
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name="Тип связанной сущности"
    )
    object_id = models.CharField(
        verbose_name="ID связанной сущности"
    )
    content_object = GenericForeignKey("content_type", "object_id")

    message = models.TextField(verbose_name="Сообщение")
    url = models.URLField(null=True, blank=True, verbose_name="Ссылка")
    is_read = models.BooleanField(default=False, verbose_name="Прочитано")

    class Meta:
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"
        ordering = ["-created"]

    def __str__(self):
        return f"Уведомление для {self.user} по {self.content_object}"
