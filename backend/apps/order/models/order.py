from apps.order.models.orders_payment import OrdersPayment
from apps.photo.models import PhotoLine
from apps.utils.models_mixins.models_mixins import TimeStampedMixin
from django.db import models
from django.contrib.auth import get_user_model

from apps.order.models.const import OrderStatus

User = get_user_model()


class Order(TimeStampedMixin):
    """Модель заказа."""
    id = models.AutoField(
        primary_key=True,
        editable=False,
        verbose_name="Номер заказа"
    )
    order_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Цена заказа",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders",
        verbose_name="Пользователь",
    )
    photo_line = models.OneToOneField(
        PhotoLine,
        on_delete=models.PROTECT,
        related_name="orders",
        verbose_name="Пробник",
    )
    is_digital = models.BooleanField(
        default=False,
        verbose_name="Электронные фотографии",
    )
    is_photobook = models.BooleanField(
        default=False,
        verbose_name="Фотокнига",
    )
    status = models.PositiveSmallIntegerField(
        choices=OrderStatus.choices,
        default=OrderStatus.created,
        verbose_name="Статус заказа",
    )
    payment_id = models.CharField(
        max_length=20,
        verbose_name="Идентификатор транзакции",
        null=True,
        blank=True
    )
    order_payment = models.ForeignKey(
        OrdersPayment,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name='Оплата заказа',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f'Заказ {self.id}, {self.user}'

    def update_order_price(self):
        order_items = self.order_items.all()
        self.order_price = sum(order_item.price for order_item in order_items)
        self.save(update_fields=['order_price'])
