from django.contrib.auth import get_user_model
from django.db import models

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


User = get_user_model()


class Department(UUIDMixin, TimeStampedMixin):
    """
    Модель отдела, который может быть назначен сотруднику.
    Содержит название отдела.
    """
    name = models.CharField(
        max_length=100,
        verbose_name="Название отдела",
        unique=True
        )

    class Meta:
        verbose_name = "Отдел"
        verbose_name_plural = "Отделы"

    def __str__(self):
        return self.name


class Region(UUIDMixin, TimeStampedMixin):
    """
    Модель региона, который может быть назначен сотруднику.
    Содержит название региона.
    """
    name = models.CharField(
        max_length=100,
        verbose_name="Название региона",
        unique=True
    )

    class Meta:
        verbose_name = "Регион"
        verbose_name_plural = "Регионы"

    def __str__(self):
        return self.name


class Permission(UUIDMixin, TimeStampedMixin):
    """
    Модель прав доступа.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Название права"
    )

    class Meta:
        verbose_name = "Право"
        verbose_name_plural = "Права"

    def __str__(self):
        return self.name


class Role(UUIDMixin, TimeStampedMixin):
    """
    Модель роли сотрудника в компании.
    Содержит название роли, связь с отделом и родительской ролью.
    """
    name = models.CharField(
        max_length=100,
        verbose_name="Название роли",
        unique=True
    )
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, verbose_name="Отдел"
    )
    parent_role = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Родительская роль"
    )
    permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name="roles",
        verbose_name="Права"
    )

    class Meta:
        verbose_name = "Роль"
        verbose_name_plural = "Роли"

    def __str__(self):
        return self.name


class Employee(UUIDMixin, TimeStampedMixin):
    """
    Модель сотрудника компании. Связывается с пользователем, ролью, отделом и регионом.
    Содержит статус, который может быть 'active' или 'inactive'.
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Пользователь"
    )
    role = models.ForeignKey(
        Role, on_delete=models.SET_NULL, null=True, verbose_name="Роль"
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, verbose_name="Отдел"
    )
    region = models.ForeignKey(
        Region, on_delete=models.SET_NULL, null=True, verbose_name="Регион"
    )
    status = models.CharField(
        max_length=50,
        choices=[("active", "Активный"), ("inactive", "Неактивный")],
        verbose_name="Статус"
    )

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"

    def __str__(self):
        return f"{self.user.first_name} {self.user.second_name} {self.user.last_name} - {self.role.name}"


class ClientCard(UUIDMixin, TimeStampedMixin):
    """
    Модель карточки клиента. Связывается с ответственным менеджером (сотрудником).
    Содержит имя клиента.
    """

    client = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Клиент"
    )
    responsible_manager = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Ответственный менеджер"
    )
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Регион"
    )

    class Meta:
        verbose_name = "Карточка клиента"
        verbose_name_plural = "Карточки клиентов"

    def __str__(self):
        return f"{self.client.first_name} {self.client.last_name}"
