from decimal import Decimal

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
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен",
    )

    class Meta:
        verbose_name = 'Бонусный купон'
        verbose_name_plural = 'Бонусные купоны'

    def __str__(self):
        return f'Бонусный купон {self.user}, баланс {self.balance}'

    def use_bonus_coupon_to_price(self, price):
        """Применить купон к цене."""
        price = Decimal(price) - self.balance
        if price > Decimal(0):
            self.balance = Decimal(0)
            self.save()
            return price
        self.balance = abs(price) + Decimal(1)  # возвращаем на баланс рубль, который пользователь должен оплатить
        self.save()
        return Decimal(1)
