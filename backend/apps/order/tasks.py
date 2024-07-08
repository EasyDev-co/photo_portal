import traceback

import loguru
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

from apps.order.models import Order
from apps.order.models.const import OrderStatus

from config.celery import BaseTask, app
from config.settings import EMAIL_HOST_USER

User = get_user_model()


class DigitalPhotosNotificationTask(BaseTask):
    name = 'digital_photos_notification'

    def process(self, user_id, *args, **kwargs):
        user = User.objects.get(id=user_id)
        subject = "Ваши электронные фото готовы"
        message = "Вы можете скачать электронные фото по ссылке:{}"
        try:
            loguru.logger.info(user)
            loguru.logger.info(user.email)
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