import os
from io import BytesIO

from PIL import Image
from django.db import models
from django.core.exceptions import ValidationError

from .photo_line import PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin
from apps.utils.services.add_watermark import add_watermark
from django.conf import settings

from apps.photo.s3_client import get_s3_client


class SerialPhotoNumber(models.IntegerChoices):
    """
    Порядковый номер фотографии в пробнике.
    """
    photo_1 = 1, 'Фото 1'
    photo_2 = 2, 'Фото 2'
    photo_3 = 3, 'Фото 3'
    photo_4 = 4, 'Фото 4'
    photo_5 = 5, 'Фото 5'
    photo_6 = 6, 'Фото 6'


class Photo(UUIDMixin):
    photo_line = models.ForeignKey(
        PhotoLine,
        on_delete=models.PROTECT,
        related_name='photos',
        verbose_name='Пробник'
    )
    number = models.PositiveIntegerField(
        verbose_name='Номер', default=1,
    )
    photo_file = models.FileField(
        upload_to='',
        verbose_name='Фотография',
        blank=True,
        null=True
    )
    watermarked_photo = models.ImageField(
        upload_to='watermarked_photo/',
        verbose_name='Фотография с водяным знаком',
        blank=True,
        null=True
    )
    serial_number = models.PositiveSmallIntegerField(
        choices=SerialPhotoNumber.choices,
        verbose_name='Порядковый номер'
    )
    photo_path = models.CharField(
        verbose_name='Путь к фотографии',
        max_length=255,
        blank=True,
        null=True
    )
    watermarked_photo_path = models.CharField(
        verbose_name='Путь к фотографии с water маркой',
        max_length=255,
        blank=True,
        null=True
    )

    def __str__(self):
        return f'Фотография №{self.number}'

    class Meta:
        verbose_name = 'Фотография'
        verbose_name_plural = 'Фотографии'

    def clean(self):
        super().clean()

        photos_from_photo_line = Photo.objects.filter(photo_line=self.photo_line.id)

        if self.pk:
            photos_from_photo_line = photos_from_photo_line.exclude(pk=self.pk)

        existing_serial_numbers = photos_from_photo_line.values_list('serial_number', flat=True)

        if self.serial_number in existing_serial_numbers:
            raise ValidationError('Такой порядковый номер в данном пробнике уже существует.')

    def save(self, *args, **kwargs):
        if self.photo_file:
            s3_client = get_s3_client()

            # Подготовка путей и имен файлов
            base_folder = f'{self.photo_line.kindergarten.region.name}/{self.photo_line.kindergarten.name}/'
            original_file_name = f'{base_folder}{self.number}.jpg'
            watermarked_folder = f'{base_folder}watermark/'
            watermarked_file_name = f'{watermarked_folder}{self.number}.jpg'

            try:
                self.photo_file.open('rb')
                file_content = self.photo_file.read()
                self.photo_file.close()

                # Загрузка оригинальной фотографии в S3
                s3_client.put_object(
                    Bucket=settings.YC_BUCKET_NAME,
                    Key=original_file_name,
                    Body=file_content,
                    ACL='public-read'
                )
                self.photo_path = f"{settings.YC_S3_ENDPOINT}/{settings.YC_BUCKET_NAME}/{original_file_name}"

                # Создаем объект изображения из байтов
                original_image = Image.open(BytesIO(file_content))

                # Добавляем водяной знак
                watermarked_image = add_watermark(original_image)

                # Сохраняем изображение с водяным знаком в байтовый поток
                watermarked_image_stream = BytesIO()
                watermarked_image.save(watermarked_image_stream, format='JPEG')
                watermarked_image_stream.seek(0)

                # Загрузка фотографии с водяным знаком в S3
                s3_client.put_object(
                    Bucket=settings.YC_BUCKET_NAME,
                    Key=watermarked_file_name,
                    Body=watermarked_image_stream.read(),
                    ACL='public-read'
                )
                self.watermarked_photo_path = f"{settings.YC_S3_ENDPOINT}/{settings.YC_BUCKET_NAME}/{watermarked_file_name}"

                # Удаляем локальный файл, если он существует
                if hasattr(self.photo_file, 'path') and os.path.exists(self.photo_file.path):
                    os.remove(self.photo_file.path)
                    print(f"Локальный файл {self.photo_file.path} успешно удален.")

                self.photo_file = None

            except Exception as e:
                raise ValidationError(f"Ошибка при загрузке файла в облако: {str(e)}")

        # Сохраняем объект модели
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        s3_client = get_s3_client()

        if self.photo_path:
            self._delete_file(s3_client=s3_client, photo_path=self.photo_path)

        if self.watermarked_photo_path:
            self._delete_file(s3_client=s3_client, photo_path=self.watermarked_photo_path)

        super().delete(*args, **kwargs)

    def _delete_file(self, s3_client, photo_path):
        try:
            s3_client.delete_object(Bucket=settings.YC_BUCKET_NAME, Key=photo_path)
            print(f"Файл {self.photo_path} успешно удален из S3.")
        except Exception as e:
            print(f"Ошибка при удалении файла {self.photo_path} из S3: {str(e)}")
