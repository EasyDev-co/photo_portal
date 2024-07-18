from django.contrib import admin
from django.db import models

from apps.exceptions.api_exceptions import PhotoPriceDoesNotExist
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from apps.order.models import Order
from apps.kindergarten.models import PhotoType, PhotoPrice
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
    )

    class Meta:
        verbose_name = "Часть заказа"
        verbose_name_plural = "Части заказа"

    def __str__(self):
        return f"{self.photo_type}, {self.amount}"

    @property
    @admin.display(description='Цена')
    def price(self):
        region = self.order.photo_line.kindergarten.region
        try:
            photo_price = region.photo_prices.get(photo_type=self.photo_type).price
            price = self.amount * photo_price
        except PhotoPrice.DoesNotExist:
            raise PhotoPriceDoesNotExist
        return price
