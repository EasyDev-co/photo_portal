import traceback

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.core.mail import send_mail, send_mass_mail
from django.contrib.auth import get_user_model

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
        user = User.objects.get(id=user_id)
        subject = "Ваши электронные фото готовы"
        message = "Вы можете скачать электронные фото по ссылке:{}"
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


class CheckPhotoThemeDeadlines(BaseTask):
    """
    Периодическая задача, проверяет дедлайны всей фото-тем.
    Если до дедлайна фототемы осталось менее 24 часов - вызывает задачу на рассылку сообщений участникам фото-темы.
    """
    def process(self, *args, **kwargs):
        period = timedelta(hours=24)
        time_now = datetime.now(tz=ZoneInfo('Europe/Moscow'))
        photo_themes = PhotoTheme.objects.filter(is_active=True, date_end__lt=(time_now + period))
        mail_data = {}
        for photo_theme in photo_themes:
            photo_lines = photo_theme.photo_lines.select_related('photo_line')
            photos = Photo.objects.filter(photo_line__in=photo_lines)
            recipients = list(set(photos.values_list('child__parent__email', flat=True)))
            mail_data[photo_theme.name] = recipients
        if mail_data:
            time_left_to_photo_theme_expiration.delay(mail_data=mail_data)


class TimeLeftToPhotoThemeExpiration(BaseTask):
    """Задача отправки сообщений об истечении дедлайна фото-тем."""
    name = 'time_left_to_photo_theme_expiration'

    def process(self, mail_data, *args, **kwargs):
        messages = []
        for photo_theme, recipients in mail_data.items():
            messages.append(
                [
                    f'Истекает срок заказа фотографий по фототеме {photo_theme}',
                    f'До истечения темы {photo_theme} осталось меньше 24 часов.\n'
                    f'После истечения срока Вы больше не сможете заказать фотографии'
                    'Проверьте личный кабинет {ссылка}',
                    EMAIL_HOST_USER,
                    recipients,
                ]
            )
        try:
            send_mass_mail(
                messages,
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
time_left_to_photo_theme_expiration = app.register_task(TimeLeftToPhotoThemeExpiration)
app.register_task(CheckPhotoThemeDeadlines)
