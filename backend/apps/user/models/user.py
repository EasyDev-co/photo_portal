from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from apps.kindergarten.models import Kindergarten
from apps.user.managers import UserManager
from apps.user.validators import validate_cyrillic
from apps.utils.models_mixins.models_mixins import UUIDMixin


class UserRole(models.IntegerChoices):
    """
    Роли пользователей.
    """
    parent = 1, 'Родитель'
    manager = 2, 'Заведующий'
    staff = 3, 'Сотрудник компании'


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
        blank=True,
        null=True,
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
        null=True,
        blank=True,
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Подтверждение email',
    )
    phone_number = PhoneNumberField(
        max_length=12,
        unique=True,
        verbose_name='Номер телефона',
        null=True,
        blank=True
    )
    un_hashed_password = models.CharField(
        verbose_name="Пароль заведующей",
        max_length=256,
        blank=True,
        null=True
    )
    managed_kindergarten = models.OneToOneField(
        Kindergarten,
        on_delete=models.SET_NULL,
        related_name='manager',
        verbose_name='Детский сад (заведующий)',
        null=True,
        blank=True
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='День рождения'
    )
    manager_discount = models.DecimalField(
        verbose_name="Скидка заведующей",
        decimal_places=2,
        max_digits=3,
        default=0,
    )
    manager_discount_balance = models.PositiveIntegerField(
        default=3000,
        verbose_name="Баланс заведующей на бесплатный заказ",
    )

    manager_percent = models.DecimalField(
        verbose_name="Процент заведующей",
        decimal_places=2,
        max_digits=3,
        default=0,
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f"{self.first_name} {self.second_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.second_name} {self.last_name}"

    def clean(self):
        super().clean()
        if self.role == UserRole.manager:
            if not self.managed_kindergarten:
                raise ValidationError("Заведующий должен быть связан с одним детским садом.")
            if self.kindergarten.exists() and self.kindergarten.first() != self.managed_kindergarten:
                raise ValidationError("Заведующий не может иметь несколько детских садов.")
        else:
            if self.managed_kindergarten:
                raise ValidationError("Только заведующий может иметь связанный детский сад.")


class StaffUser(User):
    """
    Прокси-модель для персонала для представления в админке.
    """

    class Meta:
        proxy = True
        verbose_name = 'Персонал'
        verbose_name_plural = 'Персонал'
