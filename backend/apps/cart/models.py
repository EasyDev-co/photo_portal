from django.db import models
from django.contrib.auth import get_user_model

from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


from apps.photo.models import Photo, PhotoLine

from apps.photo.models import Photo
from apps.kindergarten.models import PhotoType

User = get_user_model()


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


class Cart(UUIDMixin, TimeStampedMixin):
    """Модель корзины."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='carts',
        verbose_name='Пользователь',
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Корзина активна',
    )
    photo_lines = models.ManyToManyField(
        PhotoLine,
        through=CartPhotoLine,
        through_fields=(
            'cart',
            'photo_line',
        ),
        verbose_name='Фотолинии',
    )

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self):
        return f'Корзина {self.user}'
