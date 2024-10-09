from django.core.mail import send_mail
from django.contrib.auth import get_user_model

from apps.user.models.email_error_log import EmailErrorLog
from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

User = get_user_model()


class SendUserCredentialsTask(BaseTask):
    name = "send_user_credentials"

    def process(self, user_id, password, username, first_name, last_name, *args, **kwargs):
        user: User = User.objects.get(id=user_id)

        subject = f'Данные для входа в систему'
        message = f'Данные для пользователя {first_name} {last_name}:\nВаш логин: {username}\nВаш пароль: {password}'

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={"user": user},
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        EmailErrorLog.objects.create(
            confirm_code=kwargs["confirm_code"],
            message=str(exc),
            is_sent=False,
            user=kwargs["user"],
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)


class ResendUserCredentials(BaseTask):
    def process(self, *args, **kwargs):
        email_error_logs = EmailErrorLog.objects.filter(
            confirm_code__is_used=False,
            is_sent=False,
        )
        for email_error_log in email_error_logs:
            send_user_credentials.delay(
                user_id=email_error_log.user.id,
                code_purpose=email_error_log.confirm_code.purpose
            )
        email_error_logs.update(is_sent=True)

send_user_credentials = app.register_task(SendUserCredentialsTask)
app.register_task(ResendUserCredentials)
