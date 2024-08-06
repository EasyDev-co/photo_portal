from datetime import datetime

from django.db import connection, transaction
from pytz import timezone

import traceback
import os
import shutil

from apps.photo.models import PhotoTheme
from config.celery import BaseTask, app
from config.settings import TIME_ZONE, PHOTO_LINE_MEDIA_PATH


def remove_qr_code():
    """Функция для удаления директорий, содержащих изображения qr кодов одной фототемы."""

    # получаем текущее время
    current_time = datetime.now().astimezone(tz=timezone(TIME_ZONE))

    # фильтруем фототемы, у которых вышел срок, но еще не были удалены qr коды
    expired_photo_theme_ids = list(PhotoTheme.objects.filter(
        date_end__lte=current_time,
        are_qrs_removed=False
    ).values_list('id', flat=True))
    if len(expired_photo_theme_ids) == 0:
        return

    # получаем список директорий
    dirs = [d for d in os.listdir(PHOTO_LINE_MEDIA_PATH) if os.path.isdir(os.path.join(PHOTO_LINE_MEDIA_PATH, d))]

    # удаляем директории с qr кодами устаревших фототем
    for expired_photo_theme_id in expired_photo_theme_ids:
        if str(expired_photo_theme_id) in dirs:
            shutil.rmtree(os.path.join(PHOTO_LINE_MEDIA_PATH, str(expired_photo_theme_id)))

    # создаем строку с параметрами для SQL-запроса
    ids_placeholder = ','.join(['%s'] * len(expired_photo_theme_ids))

    # обновляем записи в БД
    with transaction.atomic():
        with connection.cursor() as cursor:

            # обнуление qr_code у фотолиний
            cursor.execute(f"""
                UPDATE photo_photoline
                SET qr_code = NULL
                WHERE photo_theme_id IN ({ids_placeholder});
            """, expired_photo_theme_ids)

            # установка are_qrs_removed в TRUE
            cursor.execute(f"""
                UPDATE photo_phototheme
                SET are_qrs_removed = TRUE
                WHERE id IN ({ids_placeholder});
            """, expired_photo_theme_ids)


class QRCodeRemoverTask(BaseTask):
    """
    Поиск и удаление изображений QR кодов устаревших фотолиний.
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


app.register_task(QRCodeRemoverTask)
