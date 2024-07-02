from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from django.db import models
from apps.order.models import Order
from apps.order.models.const import PhotoType
from apps.photo.models import Photo


class OrderItem(UUIDMixin, TimeStampedMixin):
    """Модель части (позиции) заказа."""
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        default=PhotoType.large_photo,
        verbose_name="Тип фото",
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
    photo = models.ForeignKey(
        Photo,
        on_delete=models.CASCADE,
        related_name='order_items',
        verbose_name='Фотография',
    )

    class Meta:
        verbose_name = "Часть заказа"
        verbose_name_plural = "Части заказа"

    def __str__(self):
        return f"{self.photo_type}, {self.amount}"
