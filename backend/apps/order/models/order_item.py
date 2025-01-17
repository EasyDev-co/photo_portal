from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from apps.order.models import Order
from apps.kindergarten.models import PhotoType
from apps.photo.models import Photo


class OrderItem(UUIDMixin, TimeStampedMixin):
    """Модель части (позиции) заказа."""
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        default=PhotoType.size_20x30,
        verbose_name="Тип фото",
        blank=True,
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
        blank=True,
        null=True
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена позиции",
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Часть заказа"
        verbose_name_plural = "Части заказа"

    def __str__(self):
        return f"{self.photo_type}, {self.amount}"
