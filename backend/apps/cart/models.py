from django.db import models
from django.contrib.auth import get_user_model

from apps.promocode.models import Promocode
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin

from apps.photo.models import Photo, PhotoLine
from apps.kindergarten.models import PhotoType, Kindergarten

User = get_user_model()


class CartPhotoLine(UUIDMixin):
    """Пробник в корзине."""
    cart = models.ForeignKey(
        'Cart',
        on_delete=models.CASCADE,
        related_name='cart_photo_lines',
        verbose_name='Корзина',
        null=True,
        blank=True,
    )
    photo_line = models.ForeignKey(
        PhotoLine,
        on_delete=models.CASCADE,
        related_name='cart_photo_lines',
        verbose_name='Пробник',
        null=True,
        blank=True,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_cart_photo_lines',
        verbose_name="Пользователь",
        null=True,
        blank=True,
    )
    kindergarten = models.ForeignKey(
        Kindergarten,
        verbose_name="Детский сад",
        on_delete=models.CASCADE,
        related_name='kindergarten_cart_photo_lines',
        null=True,
        blank=True,
    )
    is_digital = models.BooleanField(
        default=False,
        verbose_name='Электронные фотографии',
    )
    is_photobook = models.BooleanField(
        default=False,
        verbose_name='Фотокнига',
    )
    is_free_calendar = models.BooleanField(
        default=False,
        verbose_name='Бесплатный календарь'
    )
    is_free_digital = models.BooleanField(
        default=False,
        verbose_name='Бесплатные электронные фотографии'
    )
    digital_price = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена за эл. фото",
    )
    all_price = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена с пересчетом id_digital"
    )
    photo_book_price = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        verbose_name="Цена за фото книгу"
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Итоговая стоимость',
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Изначальная сумма заказа",
    )
    child_number = models.IntegerField(default=1, verbose_name="Номер ребенка", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания", null=True, blank=True)

    class Meta:
        verbose_name = 'Пробник в корзине'
        verbose_name_plural = 'Пробники в корзине'
        ordering = ('created_at',)


class PhotoInCart(UUIDMixin):
    """Модель фото в корзине."""
    photo = models.ForeignKey(
        Photo,
        on_delete=models.CASCADE,
        related_name='photos_in_cart',
        verbose_name='Фото',
        null=True,
        blank=True,
    )
    cart_photo_line = models.ForeignKey(
        'CartPhotoLine',
        on_delete=models.CASCADE,
        related_name='photos_in_cart',
        verbose_name='Пробник',
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
        verbose_name='Пробники',
    )
    promocode = models.ForeignKey(
        Promocode,
        on_delete=models.CASCADE,
        related_name='carts',
        verbose_name='Промокод',
        null=True,
        blank=True,
    )
    bonus_coupon = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Баланс купона",
        null=True,
        blank=True,
    )
    order_fully_paid_by_coupon = models.BooleanField(
        default=False,
        verbose_name="Заказ полностью оплачен купоном",
    )

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'

    def __str__(self):
        return f'Корзина {self.user}'
