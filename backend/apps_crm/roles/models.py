from django.contrib.auth import get_user_model
from django.db import models
from django.core.exceptions import ValidationError

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


User = get_user_model()


class UserRole(models.IntegerChoices):
    ROP = 1, "РОП"
    MANAGER = 2, "Менеджер"
    CEO = 3, "Исполнительный директор"
    SENIOR_MANAGER = 4, "Старший менеджер"


class Employee(UUIDMixin, TimeStampedMixin):
    """
    Модель сотрудника компании. Связывается с пользователем, ролью, отделом и регионом.
    Содержит статус, который может быть 'active' или 'inactive'.
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Пользователь"
    )
    employee_role = models.PositiveSmallIntegerField(
        choices=UserRole.choices,
        default=UserRole.MANAGER,
        verbose_name="Роль пользователя"
    )
    status = models.CharField(
        max_length=50,
        choices=[("active", "Активный"), ("inactive", "Неактивный")],
        verbose_name="Статус"
    )
    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'employee_role': UserRole.SENIOR_MANAGER},
        verbose_name="Руководитель"
    )
    can_edit_task = models.BooleanField(default=False, verbose_name="Может редактировать задачу")

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        constraints = [
            models.UniqueConstraint(
                fields=['manager', 'user'],
                name='unique_manager_assignment'
            )
        ]

    def __str__(self):
        return f"user: {self.user}"

    def clean(self):
        if self.employee_role == UserRole.MANAGER and not self.manager:
            raise ValidationError("Менеджер должен быть привязан к руководителю.")
        if self.manager and self.manager.employee_role != UserRole.SENIOR_MANAGER:
            raise ValidationError("Руководитель должен иметь роль 'SENIOR_MANAGER'.")
        if (
            self.manager and
            Employee.objects.filter(manager=self.manager, employee_role=UserRole.MANAGER).exclude(pk=self.pk).exists()
        ):
            raise ValidationError("Менеджер уже привязан к другому SENIOR_MANAGER.")


# !!! Все что ниже пока не актуально !!!

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
    description = models.TextField(
        blank=True,
        verbose_name="Описание права"
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
