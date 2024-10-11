from django.core.mail import send_mail
from django.contrib.auth import get_user_model

from apps.user.models.email_error_log import EmailErrorLog
from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

User = get_user_model()


class SendUserCredentialsTask(BaseTask):

    name = "send_user_credentials"

    def process(self, user_id, password, first_name, last_name, email, *args, **kwargs):
        user: User = User.objects.get(id=user_id)

        subject = 'Ваши учетные данные для входа'
        message = (
            f'Здравствуйте, {first_name} {last_name}!\n'
            f'Ваш email для входа: {email}\n'
            f'Ваш пароль: {password}\n'
        )

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


send_user_credentials = app.register_task(SendUserCredentialsTask)
