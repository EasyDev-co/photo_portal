from django.db import models

from apps.parent.models import ConfirmCode


class SendEmailError(models.Model):
    confirm_code = models.ForeignKey(
        ConfirmCode,
        on_delete=models.PROTECT,
        verbose_name='Код'
    )
    message = models.TextField(
        verbose_name='Сообщение ошибки'
    )
    is_sent = models.BooleanField(
        default=False,
        verbose_name='Отправлено'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )
