from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db import models

from apps.kindergarten.models import Kindergarten
from apps.promocode.models import Promocode
from apps.user.managers import UserManager
from apps.user.validators import validate_phone_number, validate_cyrillic
from apps.utils.services.normalize_phone_number import normalize_phone_number
from apps.utils.models_mixins.models_mixins import UUIDMixin


class UserRole(models.IntegerChoices):
    """
    Роли пользователей.
    """
    parent = 1, 'Родитель'
    manager = 2, 'Заведующий'


class User(UUIDMixin, AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(
        max_length=56,
        validators=[MinLengthValidator(2), validate_cyrillic],
        verbose_name='Имя'
    )
    second_name = models.CharField(
        max_length=56,
        validators=[MinLengthValidator(2), validate_cyrillic],
        verbose_name='Отчество',
        blank=True
    )
    last_name = models.CharField(
        max_length=56,
        validators=[MinLengthValidator(2), validate_cyrillic],
        verbose_name='Фамилия'
    )

    role = models.PositiveSmallIntegerField(
        choices=UserRole.choices,
        default=UserRole.parent,
        verbose_name='Роль'
    )
    kindergarten = models.ManyToManyField(
        Kindergarten,
        related_name='users',
        verbose_name='Детский сад',
    )
    promocode = models.ForeignKey(
        Promocode,
        on_delete=models.CASCADE,
        related_name='users',
        verbose_name='Промокод',
        blank=True,
        null=True,
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Подтверждение email',
    )
    phone_number = models.CharField(
        max_length=12,
        validators=[validate_phone_number],
        unique=True,
        verbose_name='Номер телефона',
        null=True,
        blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f"{self.first_name} {self.second_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if self.phone_number:
            self.phone_number = normalize_phone_number(self.phone_number)
        super().save(*args, **kwargs)


class StaffUser(User):
    """
    Прокси-модель для персонала для представления в админке.
    """

    class Meta:
        proxy = True
        verbose_name = 'Персонал'
        verbose_name_plural = 'Персонал'
