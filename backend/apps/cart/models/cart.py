from django.db import models
from django.contrib.auth import get_user_model

from apps.cart.models import CartPhotoLine
from apps.photo.models import PhotoLine
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

User = get_user_model()


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
