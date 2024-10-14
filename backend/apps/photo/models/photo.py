from io import BytesIO

from django.core.files.base import ContentFile
from django.db import models
from django.core.exceptions import ValidationError
import boto3

from .photo_line import PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin
from apps.utils.services.add_watermark import add_watermark
from django.conf import settings


# Инициализация boto3 клиента
def get_s3_client():
    session = boto3.session.Session()
    s3_client = session.client(
        service_name='s3',
        region_name=settings.YC_REGION,
        endpoint_url=settings.YC_S3_ENDPOINT,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    return s3_client


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
        verbose_name='Номер',
        unique=True
    )
    photo = models.ImageField(
        upload_to='photo/',
        verbose_name='Фотография'
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
        super().save(*args, **kwargs)
        if not self.watermarked_photo:
            watermarked_photo = add_watermark(
                photo_path=self.photo,
            )
            # Сохраняем изображение в байтовый поток
            buffer = BytesIO()
            watermarked_photo.save(buffer, format='JPEG')
            buffer.seek(0)

            # Сохраняем как объект Django
            self.watermarked_photo.save(
                f'{str(self.photo_line.photo_theme.name)}_watermarked.jpg',
                ContentFile(buffer.read()),
            )

        # Загрузка фотографии в S3
        folder_name = f'{self.photo_line.kindergarten.region.name}/{self.photo_line.kindergarten.name}/'
        file_name = f'{folder_name}{self.number}.jpg'

        s3_client = get_s3_client()
        with self.photo.open('rb') as img_file:
            s3_client.upload_fileobj(img_file, settings.YC_BUCKET_NAME, file_name)

    def delete(self, *args, **kwargs):
        # Удаление фотографии из S3
        file_name = f'{self.photo_line.kindergarten.region.name}/{self.photo_line.kindergarten.name}/{self.name}.jpg'
        s3_client = get_s3_client()
        s3_client.delete_object(Bucket=settings.YC_BUCKET_NAME, Key=file_name)
        super().delete(*args, **kwargs)
