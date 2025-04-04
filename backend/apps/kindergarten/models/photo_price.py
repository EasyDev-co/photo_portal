from django.db import models
from django.core.exceptions import ValidationError

from apps.utils.models_mixins.models_mixins import UUIDMixin
from apps.kindergarten.models.region import Region


class PhotoType(models.IntegerChoices):
    """
    Типы печатной продукции для фотографий.
    """
    size_10x15 = 1, '10x15'
    size_15x20 = 2, '15x20'
    size_20x30 = 3, '20x30'
    magnet = 4, 'Магнит'
    calendar = 5, 'Календарь'
    photobook = 6, 'Фотокнига'
    free_calendar = 7, 'Календарь в подарок'
    digital = 0, 'Электронные фото'


class PhotoPrice(UUIDMixin):
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Цена',
    )
    region = models.ForeignKey(
        Region,
        on_delete=models.CASCADE,
        related_name='photo_prices',
        verbose_name='Регион',
        null=True,
        blank=True
    )
    photo_type = models.PositiveSmallIntegerField(
        choices=PhotoType.choices,
        default=PhotoType.size_10x15,
        verbose_name='Тип фотографии'
    )

    def __str__(self):
        return f'Фото ({self.get_photo_type_display()}) {self.price}'

    class Meta:
        verbose_name = 'Цена фото'
        verbose_name_plural = 'Цены фото'

    def clean(self):

        if self._state.adding and PhotoPrice.objects.filter(
            region=self.region,
            photo_type=self.photo_type
        ).exists():
            raise ValidationError(
                f"Запись с типом фото '{self.get_photo_type_display()}' и регионом '{self.region}' уже существует."
            )

        if self.region and self.region.name in ['Москва', 'Санкт-Петербург'] and self.price == 0:
            raise ValidationError(f'Необходимо указать цену для региона {self.region.name}.')

    def get_price_for_region(self, region_name):
        """Возвращает цену для указанного региона или общую цену, если регион не Москва/СПБ."""
        match region_name:
            case 'Москва' | 'Санкт-Петербург':
                return self.price
            case _:
                common_price = PhotoPrice.objects.filter(region__isnull=True, photo_type=self.photo_type).first()
                return common_price.price if common_price else self.price
