import traceback

from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.photo.models import PhotoTheme
from apps.promocode.models import Promocode
from apps.user.models.user import UserRole
from apps.utils.services.remove_qr_code import remove_qr_code
from config.celery import BaseTask, app

User = get_user_model()


class QRCodeRemoverTask(BaseTask):
    """
    Поиск и удаление изображений QR кодов устаревших пробников.
    """

    def process(self, *args, **kwargs):
        try:
            remove_qr_code()
        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={},
                einfo=traceback.format_exc(),
            )


@shared_task
def generate_promocodes_for_photo_theme(photo_theme_id):
    """
    Задача для генерации промокодов для всех заведующих.
    """
    photo_theme = PhotoTheme.objects.get(id=photo_theme_id)
    users = User.objects.filter(role=UserRole.manager)

    promo_codes = []
    for user in users:
        promo_code = Promocode(
            photo_theme=photo_theme,
            user=user,
            code=Promocode.generate_unique_code()
        )
        promo_codes.append(promo_code)

    Promocode.objects.bulk_create(promo_codes)


class UpdatePhotoThemeActivityTask(BaseTask):
    """
    Поиск и деактивация фототем, у которых прошел дедлайн.
    """
    def run(self, *args, **kwargs):
        # деактивируем прошедшие фототемы
        PhotoTheme.objects.filter(
            is_active=True,
            date_end__lt=timezone.now()
        ).update(is_active=False)


app.register_task(QRCodeRemoverTask)
app.register_task(UpdatePhotoThemeActivityTask)
