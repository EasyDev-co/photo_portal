from django.db import models
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten
from apps.order.models import OrdersPayment
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


class Receipt(UUIDMixin, TimeStampedMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name="receipts",
        verbose_name="Пользователь",
    )
    receipt = models.FileField(
        upload_to="receipts/",
        null=True,
        blank=True,
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        on_delete=models.PROTECT,
        verbose_name='Детский сад',
        related_name='receipts',
    )
    orders_payment = models.OneToOneField(
        OrdersPayment,
        on_delete=models.PROTECT,
        verbose_name='Заказы',
        related_name='receipts',
    )

    def __str__(self):
        return f"Чек заказа {self.orders_payment.id}, {self.user}"

    class Meta:
        verbose_name = 'Чек'
        verbose_name_plural = 'Чеки'
