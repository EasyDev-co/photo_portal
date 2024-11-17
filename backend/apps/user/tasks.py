import traceback
import secrets

from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db import transaction

from apps.user.models import ConfirmCode
from apps.user.models.code import CodePurpose
from apps.user.models.email_error_log import EmailErrorLog

from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

User = get_user_model()


class SendConfirmCodeTask(BaseTask):
    name = "send_confirm_code"

    def process(self, user_id, code_purpose, *args, **kwargs):
        user: User = User.objects.get(id=user_id)
        code = self.generate_numeric_code()
        if code_purpose == CodePurpose.RESET_PASSWORD:
            subject = 'Сброс пароля'
            message = 'Код для сброса пароля:\n'
        elif code_purpose == CodePurpose.CONFIRM_EMAIL:
            subject = 'Подтверждение почты'
            message = 'Код для подтверждения почты:\n'
        else:
            raise ValueError('Неизвестный code_purpose.')

        with transaction.atomic():
            ConfirmCode.objects.filter(
                user=user,
                purpose=code_purpose,
                is_used=False
            ).update(is_used=True)

            confirm_code = ConfirmCode.objects.create(
                user=user,
                code=code,
                purpose=code_purpose,
            )

        try:
            send_mail(
                subject=subject,
                message=message + code,
                from_email=EMAIL_HOST_USER,
                recipient_list=(user.email,),
                fail_silently=False,
            )
        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={"confirm_code": confirm_code, "user": user},
                einfo=traceback.format_exc()
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        EmailErrorLog.objects.create(
            confirm_code=kwargs['confirm_code'],
            message=str(exc),
            is_sent=False,
            user=kwargs['user'],
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)

    @staticmethod
    def generate_numeric_code():
        return str(secrets.randbelow(10000)).zfill(4)


class ResendConfirmCodeTask(BaseTask):
    def process(self, *args, **kwargs):
        email_error_logs = EmailErrorLog.objects.filter(
            confirm_code__is_used=False,
            is_sent=False,
        )
        for email_error_log in email_error_logs:
            send_confirm_code.delay(
                user_id=email_error_log.user.id,
                code_purpose=email_error_log.confirm_code.purpose
            )
        email_error_logs.update(is_sent=True)


send_confirm_code = app.register_task(SendConfirmCodeTask)
app.register_task(ResendConfirmCodeTask)
