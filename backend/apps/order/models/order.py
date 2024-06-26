from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin
from django.db import models
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten
from apps.order.models.const import OrderStatus

User = get_user_model()


class Order(UUIDMixin, TimeStampedMixin):
    """Модель заказа."""
    order_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Цена заказа",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Пользователь",
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.PROTECT,
        related_name="orders",
        verbose_name="Детский сад",
    )
    status = models.PositiveSmallIntegerField(
        choices=OrderStatus.choices,
        default=OrderStatus.created,
        verbose_name="Статус заказа",
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f'Заказ {self.id}, {self.user}'