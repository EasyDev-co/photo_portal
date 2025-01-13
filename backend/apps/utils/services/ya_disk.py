import random
import string
import urllib.parse
from pathlib import PurePosixPath

import yadisk

from apps.kindergarten.models import PhotoType, Kindergarten
from apps.order.models import Order
from apps.photo.models import KindergartenPhotoTheme, PhotoTheme
from apps.photo.models.const import MONTHS_RU
from config.settings import YAD_OAUTH_TOKEN, YAD_CLIENT_ID, YAD_CLIENT_SECRET, YAD_URL
from dataclasses import dataclass

from loguru import logger


@dataclass
class FileDTO:
    """Data Transfer Object для файлов."""
    file_url: str
    yadisk_path: str
    file_name: str


class YaDiskService:
    """Сервис для работы с Яндекс Диском"""

    def __init__(self):
        self.client = yadisk.Client(YAD_CLIENT_ID, YAD_CLIENT_SECRET, YAD_OAUTH_TOKEN)

    def _create_directories(self, path: PurePosixPath):
        """Рекурсивное создание директорий на Яндекс Диске"""
        parts = path.parts
        current_path = PurePosixPath("/")

        for part in parts:
            current_path /= part
            if not self.client.exists(str(current_path)):
                try:
                    self.client.mkdir(str(current_path))
                except yadisk.exceptions.PathExistsError:
                    pass
                except yadisk.exceptions.YaDiskError as e:
                    logger.error(
                        f"Ошибка при создании директории {current_path}: {e}"
                    )

    def upload(self, files: list[FileDTO]):
        with self.client:
            for file in files:
                current_path = PurePosixPath(file.yadisk_path)
                self._create_directories(current_path)
                try:
                    encoded_file_url = urllib.parse.quote(file.file_url, safe=':/')
                    self.client.upload_url(
                        encoded_file_url,
                        str(current_path / file.file_name)
                    )
                except yadisk.exceptions.PathExistsError:
                    pass
                except yadisk.exceptions.YaDiskError as e:
                    logger.error(
                        f"Ошибка при загрузке файла {file.file_name} в {current_path}"
                        f" (путь до файла: {file.file_url}): {e}"
                    )


def generate_random_string(length=10) -> str:
    """Функция для генерации строки для названия файла"""
    return ''.join(random.choices(string.ascii_letters, k=length))

def save_link_to_model(yadisk_base_path: str, kindergarten: Kindergarten, photo_theme: PhotoTheme):
    instance = KindergartenPhotoTheme.objects.get(
        kindergarten=kindergarten,
        photo_theme=photo_theme,
    )
    if instance.ya_disk_link is None:
        instance.ya_disk_link = f'{YAD_URL}{yadisk_base_path}'
        instance.save()


def create_file_dtos_from_order(order: Order) -> list[FileDTO]:
    """Создание списка FileDTO из заказа."""
    kindergarten = order.photo_line.kindergarten.name

    year = order.photo_line.photo_theme.date_end.strftime("%Y")
    month = MONTHS_RU.get(order.photo_line.photo_theme.date_end.strftime("%B"))

    yadisk_base_path = f"/{year}/{month}/{kindergarten}"

    save_link_to_model(yadisk_base_path, order.photo_line.kindergarten, order.photo_line.photo_theme)

    files = []
    for order_item in order.order_items.all():
        if not order_item.photo:
            logger.warning(f"order_item {order_item} не имеет связанной фотографии.")
            continue

        yadisk_path = f"{yadisk_base_path}/{PhotoType(order_item.photo_type).label}"

        if order_item.photo_type == PhotoType.photobook:
            # Добавляем все фотографии в папку Фотокнига
            for photo in order.photo_line.photos.all():
                files.append(
                    FileDTO(
                        file_url=photo.photo_path,
                        yadisk_path=yadisk_path,
                        file_name=f"{photo.number}.jpg"
                    )
                )
            continue

        logger.info(f"Путь до файла: {yadisk_path}/{order_item.photo.number}_({order_item.amount} шт.).jpg")

        files.append(
            FileDTO(
                file_url=order_item.photo.photo_path,
                yadisk_path=yadisk_path,
                file_name=f"{order_item.photo.number}_({order_item.amount} шт.).jpg"
            )
        )
    return files


def get_yadisk_service() -> YaDiskService:
    return YaDiskService()
