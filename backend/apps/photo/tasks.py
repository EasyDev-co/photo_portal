import traceback
from zoneinfo import ZoneInfo

from celery import shared_task
from datetime import datetime
from django.contrib.auth import get_user_model
from django.utils import timezone
from unisender_go_api import SyncClient, SendRequest

from apps.photo.models import PhotoTheme, KindergartenPhotoTheme
from apps.promocode.models import Promocode
from apps.user.models.user import UserRole
from apps.utils.services.remove_qr_code import remove_qr_code
from config.celery import BaseTask, app
from config.settings import FROM_EMAIL, UNISENER_TOKEN, TIME_ZONE, PRINTER_EMAIL
from loguru import logger

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
    Поиск и деактивация фотосессий, у которых прошел дедлайн.
    """

    def run(self, *args, **kwargs):
        # деактивируем прошедшие фототемы
        photoshoots = KindergartenPhotoTheme.objects.filter(
            is_active=True,
            photo_theme__date_end__lt=timezone.now()
        )

        if photoshoots.exists():
            photoshoot_ids = list(photoshoots.values_list('id', flat=True))
            send_photoshoot_to_printer.delay(photoshoot_ids)

            photoshoots.update(is_active=False)


class SendPhotoshootToPrinterTask(BaseTask):
    """
    Задача для отправки фотосесии печатнику после дедлайна.
    """

    @staticmethod
    def prepare_photoshoots_data(photoshoot_ids: list) -> list[dict]:
        raw_photoshoots = KindergartenPhotoTheme.objects.filter(id__in=photoshoot_ids)

        time_now = datetime.now(tz=ZoneInfo(TIME_ZONE)).date().strftime('%d.%m')
        handled_photoshoots = []

        for ps in raw_photoshoots.all():
            if ps.photo_theme.photo_lines.exists():
                kindergarten_name = f"{ps.kindergarten.name} {ps.kindergarten.locality} {ps.kindergarten.region.name}"

                # TODO: поменять "дата и время отправления" после уточнения у заказчика
                handled_photoshoots.append({
                    'subject': f"{time_now} {kindergarten_name} дата и время отправления",
                    'html': f'<a href="{ps.ya_disk_link}">{ps.ya_disk_link}</a>',
                })
        return handled_photoshoots

    def process(self, photoshoot_ids: list, *args, **kwargs):
        prepared_photoshoots = self.prepare_photoshoots_data(photoshoot_ids)

        for photoshoot in prepared_photoshoots:
            try:
                with SyncClient.setup(UNISENER_TOKEN):
                    request = SendRequest(
                        message={
                            "recipients": [{"email": PRINTER_EMAIL}],
                            "body": {
                                "html": photoshoot.get('html'),
                            },
                            "subject": photoshoot.get('subject'),
                            "from_email": FROM_EMAIL,
                        },
                    )
                    request.send()
            except Exception as e:
                self.on_failure(
                    exc=e,
                    task_id=self.request.id,
                    args=(),
                    kwargs={},
                    einfo=traceback.format_exc(),
                )


app.register_task(QRCodeRemoverTask)
app.register_task(UpdatePhotoThemeActivityTask)
send_photoshoot_to_printer = app.register_task(SendPhotoshootToPrinterTask)
