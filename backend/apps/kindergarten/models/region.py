from django.core.validators import MinLengthValidator
from django.db import models
import boto3
from django.conf import settings

from apps.kindergarten.validators import validate_cyrillic_space_dash
from apps.utils.models_mixins.models_mixins import UUIDMixin


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


class Region(UUIDMixin):
    country = models.CharField(
        verbose_name="Страна",
        max_length=56,
        default='Россия'
    )
    name = models.CharField(
        max_length=56,
        verbose_name='Название региона',
        validators=[validate_cyrillic_space_dash, MinLengthValidator(2)],
        unique=True
    )
    ransom_amount_for_digital_photos = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для электронных фотографий',
        null=True,
        blank=True
    )
    ransom_amount_for_calendar = models.PositiveSmallIntegerField(
        verbose_name='Сумма выкупа для календаря',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'
        ordering = ['name']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Создание папки для региона в S3
        folder_name = f'{self.name}/'
        s3_client = get_s3_client()
        s3_client.put_object(Bucket=settings.YC_BUCKET_NAME, Key=folder_name)
