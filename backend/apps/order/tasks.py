import traceback

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.core.mail import send_mail, send_mass_mail
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

from apps.photo.models import PhotoTheme, Photo

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
            message = (f"Ваши электронные фото готовы."
                       f"Вы можете скачать электронные фото личном кабинете.")
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


digital_photos_notification = app.register_task(DigitalPhotosNotificationTask)
