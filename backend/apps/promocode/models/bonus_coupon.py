from django.db import models
from django.contrib.auth import get_user_model

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


class BonusCoupon(UUIDMixin, TimeStampedMixin):
    """Модель бонусного купона."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bonus_coupons",
        verbose_name="Пользователь",
    )
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        verbose_name="Баланс купона",
    )

    class Meta:
        verbose_name = 'Бонусный купон'
        verbose_name_plural = 'Бонусные купоны'

    def __str__(self):
        return f'Бонусный купон {self.user}, баланс {self.balance}'
