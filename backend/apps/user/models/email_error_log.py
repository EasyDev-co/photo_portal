from django.db import models
from django.contrib.auth import get_user_model

from apps.user.models import ConfirmCode

User = get_user_model()


class EmailErrorLog(models.Model):
    confirm_code = models.ForeignKey(
        ConfirmCode,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Код',
    )
    message = models.TextField(
        verbose_name='Сообщение об ошибке',
    )
    is_sent = models.BooleanField(
        default=False,
        verbose_name='Отправлено',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        verbose_name='Пользователь',
        null=True
    )

    def __str__(self):
        return self.message

    class Meta:
        verbose_name = 'Ошибка отправки email'
        verbose_name_plural = 'Ошибки отправки email'
