from decimal import Decimal

import loguru
from django.db import models
from django.contrib.auth import get_user_model

from apps.order.models import Order
from apps.kindergarten.models import Kindergarten

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


class ManagerBonus(UUIDMixin, TimeStampedMixin):
    """Модель бонуса заведующей с продаж."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="manager_bonuses",
        verbose_name="Пользователь",
    )
    start_period_date = models.DateTimeField(
        verbose_name="Дата начала периода",
    )
    end_period_date = models.DateTimeField(
        verbose_name="Дата окончания периода",
    )
    bonus_size = models.DecimalField(
        max_digits=3,
        decimal_places=0,
        verbose_name="Размер бонуса %",
    )
    total_bonus = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Общая сумма бонуса",
    )
    paid_for = models.BooleanField(
        default=False,
        verbose_name="Выплачен",
    )

    class Meta:
        verbose_name = "Бонус заведующей с продаж"
        verbose_name_plural = "Бонусы заведующих с продаж"

    def __str__(self):
        return f"Бонус с продаж {self.user} за период {self.start_period_date} - {self.end_period_date}"
