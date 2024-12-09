import logging
import random
import string
import urllib.parse
from pathlib import PurePosixPath

import yadisk

from apps.kindergarten.models import PhotoType
from apps.order.models import Order
from config.settings import YAD_OAUTH_TOKEN, YAD_CLIENT_ID, YAD_CLIENT_SECRET
from dataclasses import dataclass

logger = logging.getLogger(__name__)


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


def create_file_dtos_from_order(order: Order) -> list[FileDTO]:
    """Создание списка FileDTO из заказа."""
    region = order.photo_line.kindergarten.region.name
    kindergarten = order.photo_line.kindergarten.name
    photo_theme = order.photo_line.photo_theme.name
    user = order.user.full_name

    yadisk_base_path = f"/{region}/{kindergarten}/{photo_theme}/{user}"

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
