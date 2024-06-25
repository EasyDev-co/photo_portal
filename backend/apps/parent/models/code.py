from django.db import models
from django.utils import timezone

from apps.parent.models import Parent


class CodePurpose(models.IntegerChoices):
    RESET_PASSWORD = 1, 'Сброс пароля'
    CONFIRM_EMAIL = 2, 'Подтверждение email'


class ConfirmCode(models.Model):
    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        verbose_name='Родитель'
    )
    code = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Код',
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )
    purpose = models.IntegerField(
        choices=CodePurpose.choices,
        verbose_name='Цель'
    )
    is_used = models.BooleanField(
        default=False,
        verbose_name='Использован'
    )

    def __str__(self):
        return f"Код для {self.parent}"

    @property
    def is_expired(self):
        expiration_date = self.created_at + timezone.timedelta(hours=24)
        return timezone.now() > expiration_date
