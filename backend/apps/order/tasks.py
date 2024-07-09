import traceback

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

from apps.photo.models import PhotoTheme
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
                       f"Вы можете скачать электронные фото личном кабинете.\n\n"
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
                    kwargs={},
                    einfo=traceback.format_exc(),
                )


class CheckPhotoThemeDeadlinesTask(BaseTask):
    """
    Периодическая задача, проверяет дедлайны всей фото-тем.
    """

    def process(self, *args, **kwargs):
        notification_period = timedelta(hours=24)
        time_now = datetime.now(tz=ZoneInfo('Europe/Moscow'))
        photo_themes = PhotoTheme.objects.filter(is_active=True, date_end__lt=(time_now + notification_period))
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
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={},
                einfo=traceback.format_exc(),
            )


digital_photos_notification = app.register_task(DigitalPhotosNotificationTask)
app.register_task(CheckPhotoThemeDeadlinesTask)
send_deadline_notification = app.register_task(SendDeadLineNotificationTask)
