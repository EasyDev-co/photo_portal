import traceback

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

from apps.photo.models import PhotoTheme
from apps.user.models.email_error_log import EmailErrorLog
from apps.user.models.user import UserRole

User = get_user_model()


class DigitalPhotosNotificationTask(BaseTask):
    """
    Задача отправления уведомления о готовности электронных фото.
    Срабатывает через signals.py при изменении статуса Order на digital_order_is_completed.
    """
    name = 'digital_photos_notification'

    def process(self, user_id, *args, **kwargs):
        user = get_object_or_404(User, id=user_id)
        if user:
            subject = f"Ваши электронные фото готовы."
            message = (f"Ваши электронные фото готовы.\n"
                       f"Вы можете скачать электронные фото в личном кабинете.\n\n"
                       f"C уважением,\n"
                       f"Администрация Фото-портала")
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=EMAIL_HOST_USER,
                    recipient_list=(user.email,),
                    fail_silently=False,
                )
            except Exception as e:
                self.on_failure(
                    exc=e,
                    task_id=self.request.id,
                    args=(),
                    kwargs={'user': user},
                    einfo=traceback.format_exc(),
                )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        EmailErrorLog.objects.create(
            message=str(exc),
            is_sent=False,
            user=kwargs['user'],
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)


class CheckPhotoThemeDeadlinesTask(BaseTask):
    """
    Периодическая задача, проверяет дедлайны всей фото-тем.
    """

    def process(self, *args, **kwargs):
        notification_period = timedelta(hours=24)
        time_now = datetime.now(tz=ZoneInfo('Europe/Moscow'))
        time_left_to_deadline = time_now + notification_period
        time_border_to_send_notification = time_left_to_deadline - timedelta(hours=2)
        photo_themes = PhotoTheme.objects.filter(
            is_active=True,
            date_end__lt=time_left_to_deadline,
            date_end__gt=time_border_to_send_notification
        )
        kindergartens = photo_themes.values_list('photo_lines__kindergarten', flat=True)
        users = User.objects.filter(kindergarten__in=kindergartens, role=UserRole.parent)
        recipients = list(users.values_list('email', flat=True))
        if recipients:
            send_deadline_notification(recipients=recipients)


class SendDeadLineNotificationTask(BaseTask):
    """
    Задача для отправки уведомлений об истечении дедлайна фото-темы.
    """
    name = 'send_deadline_notification'

    def process(self, recipients, *args, **kwargs):
        subject = f"До истечения срока фото-темы осталось менее 24 часов."
        message = (f"До истечения срока фото-темы осталось менее 24 часов.\n"
                   f"После истечения срока Вы больше не сможете заказать фотографии.\n\n"
                   f"C уважением,\n"
                   f"Администрация Фото-портала"
                   )
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=EMAIL_HOST_USER,
                recipient_list=recipients,
                fail_silently=False,
            )
        except Exception as e:
            users = User.objects.filter(email__in=recipients)
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={'users': users},
                einfo=traceback.format_exc(),
            )

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        email_error_logs = [
            EmailErrorLog(
                message=str(exc),
                is_sent=False,
                user=user,
            ) for user in kwargs['users']
        ]
        EmailErrorLog.objects.bulk_create(email_error_logs)
        super().on_failure(exc, task_id, args, kwargs, einfo)


digital_photos_notification = app.register_task(DigitalPhotosNotificationTask)
app.register_task(CheckPhotoThemeDeadlinesTask)
send_deadline_notification = app.register_task(SendDeadLineNotificationTask)
