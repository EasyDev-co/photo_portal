from django.db import models
from django.core.exceptions import ValidationError

from .photo_line import PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin


class SerialPhotoNumber(models.IntegerChoices):
    """
    Порядковый номер фотографии в фотолинии.
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
        verbose_name='Линия фотографий'
    )
    number = models.PositiveIntegerField(
        verbose_name='Номер',
        unique=True
    )
    photo = models.ImageField(
        upload_to='photo/',
        verbose_name='Фотография'
    )

    serial_number = models.PositiveSmallIntegerField(
        choices=SerialPhotoNumber.choices,
        verbose_name='Порядковый номер'
    )

    def __str__(self):
        return f'Фото №{self.number}'

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
            raise ValidationError('Такой порядковый номер в данной фотолинии уже существует.')
