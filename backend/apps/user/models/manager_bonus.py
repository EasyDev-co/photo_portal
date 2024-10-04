from decimal import Decimal

import loguru
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth import get_user_model

from apps.photo.models import PhotoTheme

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
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.SET_NULL,
        related_name="manager_bonuses",
        verbose_name="Фототема",
        null=True,
    )
    bonus_size = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name="Размер бонуса %",
        validators=[MinValueValidator(Decimal(0)), MaxValueValidator(Decimal(100))],
        default=Decimal("20.00"),
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
        return f"Бонус с продаж {self.user} за фототему {self.photo_theme}"

    @property
    def percentage(self):
        return self.bonus_size / Decimal('100.00')
