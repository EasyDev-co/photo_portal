from datetime import datetime

from django.db import connection, transaction
from pytz import timezone

import os
import shutil

from apps.photo.models import PhotoTheme, PhotoLine
from config.settings import TIME_ZONE, PHOTO_LINE_MEDIA_PATH


def remove_qr_code():
    """Функция для удаления директорий, содержащих изображения qr кодов одной фототемы."""

    # получаем текущее время
    current_time = datetime.now().astimezone(tz=timezone(TIME_ZONE))

    # фильтруем фототемы, у которых вышел срок, но еще не были удалены qr коды
    expired_photo_theme_ids = PhotoTheme.objects.filter(
        date_end__lte=current_time,
        are_qrs_removed=False
    ).values_list('id', flat=True)
    if len(expired_photo_theme_ids) == 0:
        return

    # получаем список директорий
    dirs = [d for d in os.listdir(PHOTO_LINE_MEDIA_PATH) if os.path.isdir(os.path.join(PHOTO_LINE_MEDIA_PATH, d))]

    # удаляем директории с qr кодами устаревших фототем
    for expired_photo_theme_id in expired_photo_theme_ids:
        if str(expired_photo_theme_id) in dirs:
            shutil.rmtree(os.path.join(PHOTO_LINE_MEDIA_PATH, str(expired_photo_theme_id)))

    # обновляем записи в БД
    with transaction.atomic():

        # обнуление qr_code у фотолиний
        PhotoLine.objects.filter(
            photo_theme_id__in=expired_photo_theme_ids
        ).update(qr_code=None)

        # установка are_qrs_removed в TRUE
        PhotoTheme.objects.filter(
            id__in=expired_photo_theme_ids
        ).update(are_qrs_removed=True)
