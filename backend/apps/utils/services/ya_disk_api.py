import urllib.parse
import requests
from http import HTTPStatus

from config.settings import YAD_API_BASE_URL, YAD_OAUTH_TOKEN


class YaDiskApiService:
    """Сервис для работы с API Яндекс Диска."""

    def __init__(self) -> None:
        self._url = YAD_API_BASE_URL
        self._headers = {"Authorization": "OAuth {}".format(YAD_OAUTH_TOKEN)}

    # Общие методы для сервиса
    @staticmethod
    def convert_path_to_url(path):
        """Преобразовать путь в формат URL."""
        return urllib.parse.quote_plus(path)

    def get_root_list(self):
        """Получить содержимое корневого каталога приложения."""
        url = self._url + "resources?path=app:/"
        response = requests.get(url=url, headers=self._headers)
        if response.status_code == HTTPStatus.OK:
            return response.json()
        return response.json()["description"]

    def get_upload_url(self, upload_path):
        """Создать ссылку для загрузки файла."""
        url = self._url + "resources/upload?path=" + upload_path
        response = requests.get(url=url, headers=self._headers)
        if response.status_code == HTTPStatus.OK:
            return response.json()["href"]
        return {"message": f"не удалось получить ссылку для загрузки: {url}"}

    def upload_file(self, upload_url, file):
        """Загрузка одного файла на Яндекс диск."""
        response = requests.put(url=upload_url, headers=self._headers, data=file)
        if response.status_code == HTTPStatus.OK:
            return response.json()
        return {"message": f"не удалось загрузить файл {upload_url}"}

    def get_folder_meta(self, path):
        """Получить мета-данные папки (для проверки ее наличия)."""
        path = self.convert_path_to_url(path)
        url = self._url + "resources?path=" + path
        response = requests.get(url=url, headers=self._headers)
        if response.status_code == HTTPStatus.OK:
            return response.json()
        return {"message": f"не удалось получить мета-данные каталога {path}"}

    def get_or_create_folder(self, path):
        """Получить URL или создать папку (при ее отсутствии)."""
        folder_meta = self.get_folder_meta(path=path)
        try:
            check = folder_meta['_embedded']
            return folder_meta['_embedded']['path']
        except KeyError as e:
            path = self.convert_path_to_url(path)
            url = self._url + "resources?path=" + path
            response = requests.put(url=url, headers=self._headers)
            response = urllib.parse.unquote_plus(response.json()['href'])
            return response

    # Методы для фотопортала
    def prepare_data_for_digital_photos(self, photo_line, user):
        """
        Подготовить данные для загрузки электронных фото.
        Проверяет папку пользователя и фотолинии.
        Принимает фотолинию.
        Возвращает путь папки фотолинии.
        """
        kindergarten = photo_line.kindergarten
        region = kindergarten.region
        user_folder_path = f"Photo_portal/{region.name}/{kindergarten.name}/Электронные_фото/{user}"
        photo_line_folder_path = f"Photo_portal/{region.name}/{kindergarten.name}/Электронные_фото/{user}/{photo_line.photo_theme} {photo_line.id}"
        self.get_or_create_folder(path=user_folder_path)
        self.get_or_create_folder(path=photo_line_folder_path)
        return photo_line_folder_path

    def upload_digital_photos(self, photo_line, user):
        """Загрузить фото для передачи пользователю в электронном виде."""
        photo_line_folder_path = self.prepare_data_for_digital_photos(photo_line, user)
        digital_photos = photo_line.photos.select_related('photo_line')
        for photo in digital_photos:
            photo_path = f"{photo_line_folder_path}/{photo.number}.jpg"
            upload_url = self.get_upload_url(upload_path=photo_path)

            photo_image = bytes(photo.photo.read())
            self.upload_file(upload_url=upload_url, file=photo_image)
