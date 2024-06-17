import traceback
from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction

from apps.parent.models import ConfirmCode, Parent
from apps.parent.models.code import CodePurpose
from apps.parent.models.email_error_log import EmailErrorLog
from apps.user.models import User
from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER


class SendConfirmCodeTask(BaseTask):
    name = "send_confirm_code"

    def process(self, user_id, code_purpose, *args, **kwargs):
        user: User = User.objects.get(id=user_id)
        code = default_token_generator.make_token(user)
        parent = Parent.objects.get(user=user)

        if code_purpose == CodePurpose.RESET_PASSWORD:
            subject = 'Восстановление пароля'
            message = 'Код восстановления пароля:\n'
        elif code_purpose == CodePurpose.CONFIRM_EMAIL:
            subject = 'Подтверждение почты'
            message = 'Код для подтверждения почты:\n'
        else:
            raise ValueError('Неизвестный code_purpose.')

        with transaction.atomic():
            ConfirmCode.objects.filter(
                parent=parent,
                purpose=code_purpose,
                is_used=False
            ).update(is_used=True)

            confirm_code = ConfirmCode.objects.create(
                parent=parent,
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
                kwargs={"confirm_code": confirm_code, "parent": parent},
                einfo=traceback.format_exc()
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        EmailErrorLog.objects.create(
            confirm_code=kwargs['confirm_code'],
            message=str(exc),
            is_sent=False,
            parent=kwargs['parent'],
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)


class ResendConfirmCodeTask(BaseTask):
    def process(self):
        email_error_logs = EmailErrorLog.objects.filter(
            confirm_code__is_used=False,
            is_sent=False
        )
        for email_error_log in email_error_logs:
            send_confirm_code.delay(
                user_id=email_error_log.parent.user.id,
                code_purpose=email_error_log.confirm_code.purpose
            )
        email_error_logs.update(is_sent=True)


send_confirm_code = app.register_task(SendConfirmCodeTask)
app.register_task(ResendConfirmCodeTask)
