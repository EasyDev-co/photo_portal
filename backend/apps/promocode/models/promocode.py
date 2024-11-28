from decimal import Decimal
from random import choice
import string

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models

from apps.photo.models import PhotoTheme
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()

PROMO_CODE_CHARACTERS = string.ascii_uppercase + string.digits


def generate_promo_code(length: int = 10) -> str:
    """
    Генерация случайного промокода из букв и цифр.
    """
    return ''.join(choice(PROMO_CODE_CHARACTERS) for _ in range(length))


class Promocode(UUIDMixin, TimeStampedMixin):
    """Модель промокода для заведующих."""

    code = models.CharField(
        max_length=200,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="Промокод",
    )
    photo_theme = models.ForeignKey(
        PhotoTheme,
        on_delete=models.CASCADE,
        related_name="promo_codes",
        verbose_name="Фотосессия",
        null=True,
        blank=True,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="promo_codes",
        verbose_name="Заведующий"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен",
    )
    discount_services = models.PositiveIntegerField(
        default=50,
        validators=(MaxValueValidator(100),),
        verbose_name="Скидка на все услуги (%)"
    )
    discount_photobooks = models.PositiveIntegerField(
        default=20,
        validators=(MaxValueValidator(100),),
        verbose_name="Скидка на фотокниги (%)"
    )
    activate_count = models.PositiveSmallIntegerField(
        default=1,
        verbose_name="Кол-во активаций промо кода",
    )
    used_by = models.JSONField(
        verbose_name='Кем использован',
        null=True,
        blank=True,
        default=list
    )

    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"
        ordering = ("-created",)

    def __str__(self):
        return f"Промокод: {self.code}, Фотосессия: {self.photo_theme}, Пользователь: {self.user}"

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_unique_code()
        if not self._state.adding:
            old = Promocode.objects.get(pk=self.pk)
            if self.user and old.user != self.user:
                raise ValidationError("Промокод принадлежит другому заведующему.")
        super().save(*args, **kwargs)

    @staticmethod
    def generate_unique_code():
        """
        Генерация уникального промокода.
        """
        while True:
            code = generate_promo_code()
            if not Promocode.objects.filter(code=code).exists():
                return code

    def apply_discount(
            self,
            price: Decimal,
            is_photobook: bool = False
    ) -> Decimal:
        """
        Применяет скидку к стоимости.
        """

        discount_rate = self.discount_photobooks if is_photobook else self.discount_services
        discount = Decimal(discount_rate) / 100
        return price * (1 - discount)
