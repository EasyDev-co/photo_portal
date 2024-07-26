from django.db import models

from apps.photo.models import Photo
from apps.kindergarten.models import PhotoType
from apps.utils.models_mixins.models_mixins import UUIDMixin


class PhotoInCart(UUIDMixin):
    """Модель фото в корзине."""
    photo = models.ForeignKey(
        Photo,
        on_delete=models.CASCADE,
        related_name='photos_in_cart',
        verbose_name='Фото',
    )
    cart_photo_line = models.ForeignKey(
        'CartPhotoLine',
        on_delete=models.CASCADE,
        related_name='photos_in_cart',
        verbose_name='Фотолиния',
    )
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        verbose_name='Тип фото',
    )
    quantity = models.PositiveSmallIntegerField(
        verbose_name='Количество',
    )
    price_per_piece = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Стоимость за шт.'
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Стоимость со скидкой'
    )

    class Meta:
        verbose_name = 'Фото в корзине'
        verbose_name_plural = 'Фото в корзине'
