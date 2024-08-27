from django.db import models
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


class OrdersPayment(UUIDMixin, TimeStampedMixin):
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Сумма',
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Оплата заказа"
        verbose_name_plural = "Оплата заказов"

    def __str__(self):
        return f"{self.id}, {self.amount}"
