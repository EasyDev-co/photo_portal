from django.db import models

from apps.cart.models import PhotoInCart
from apps.photo.models import Photo, PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin


class CartPhotoLine(UUIDMixin):
    """Фотолиния в корзине."""
    cart = models.ForeignKey(
        'Cart',
        on_delete=models.CASCADE,
        related_name='cart_photo_lines',
        verbose_name='Корзина',
    )
    photo_line = models.ForeignKey(
        PhotoLine,
        on_delete=models.CASCADE,
        related_name='cart_photo_lines',
        verbose_name='Фотолиния',
    )
    photos = models.ManyToManyField(
        Photo,
        through=PhotoInCart,
        through_fields=(
            'cart_photo_line',
            'photo'
        ),
        verbose_name='Фото'
    )
    is_digital = models.BooleanField(
        default=False,
        verbose_name='Электронные фотографии',
    )
    is_photobook = models.BooleanField(
        default=False,
        verbose_name='Фотокнига',
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Итоговая стоимость',
    )

    class Meta:
        verbose_name = 'Фотолиния в корзине'
        verbose_name_plural = 'Фотолинии в корзине'
