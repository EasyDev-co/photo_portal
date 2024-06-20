from apps.utils.models_mixins.models_mixins import UUIDMixin
from django.db import models
from apps.order.models import Order
from apps.order.models.const import PHOTO_TYPES
# импорт apps.photo.models import Photo


class OrderItem(UUIDMixin):
    """Модель части (позиции) заказа."""
    photo_type = models.CharField(
        max_length=200,
        choices=PHOTO_TYPES,
        default="10x15",
        verbose_name="Тип фото",
        null=True,
        blank=True,
    )
    is_digital = models.BooleanField(
        default=False,
        verbose_name="В электронном виде",
    )
    amount = models.PositiveIntegerField(
        default=1,
        verbose_name="Количество",
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="order_items",
        verbose_name="Заказ"
    )
    # заглушка - заменить на ForeignKey после ревью PP-4
    photo = models.UUIDField(
        verbose_name="Фотография"
    )

    class Meta:
        verbose_name = "Часть заказа"
        verbose_name_plural = "Части заказа"

    def __str__(self):
        return f"{self.photo_type}, {self.amount}"
