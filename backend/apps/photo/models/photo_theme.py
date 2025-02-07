from django.core.exceptions import ValidationError
from django.db import models
from django.utils.timezone import now
from django.utils import timezone

from .season import Season
from apps.utils.models_mixins.models_mixins import UUIDMixin, TimeStampedMixin


class PhotoThemeName(UUIDMixin, TimeStampedMixin):
    name = models.CharField(max_length=255, verbose_name="Тема фотосессии")
    season = models.ForeignKey(
        Season,
        on_delete=models.PROTECT,
        verbose_name='Сезон',
        related_name='photo_themes',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Тема фотосессии"
        verbose_name_plural = 'Темы фотосессии'


class PhotoTheme(UUIDMixin, TimeStampedMixin):
    name = models.CharField(
        max_length=255,
        verbose_name='Название',
        null=True,
        blank=True,
    )
    photo_theme_name = models.ForeignKey(
        PhotoThemeName,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Тема фотосессии"
    )
    date_start = models.DateTimeField(
        verbose_name='Дата начала',
        default=now,
        blank=True,
    )
    date_end = models.DateTimeField(
        verbose_name='Дата окончания',
        default=now,
        blank=True,
    )
    are_qrs_removed = models.BooleanField(
        verbose_name='Удалены ли QR коды',
        default=False
    )
    ransom_counted = models.BooleanField(
        verbose_name='Выкуп подсчитан',
        default=False
    )

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Фотосессия'
        verbose_name_plural = 'Фотосессии'
        ordering = ("-created",)

    def clean(self):
        super().clean()

        if not self.date_start or not self.date_end:
            raise ValidationError("Оба поля 'Дата начала' и 'Дата окончания' должны быть заполнены.")

        if self.date_start >= self.date_end:
            raise ValidationError("Дата окончания фотосессии не может быть раньше даты начала.")

    @property
    def ongoing(self) -> bool:
        return self.date_end > timezone.now()

    def get_kindergarten(self):
        """
        Возвращает единственный активный детский сад, связанный с этой фотосессией.
        Если сада нет, вернёт None.
        """
        kpt = self.kindergartenphototheme.filter(is_active=True).first()
        return kpt.kindergarten if kpt else None

    def get_kindergarten_name(self):
        """
        Возвращает название детского сада или '—' если не найден.
        """
        kindergarten = self.get_kindergarten()
        return kindergarten.name if kindergarten else '—'

    get_kindergarten_name.short_description = 'Детский сад'  # заголовок в админке

    def get_kindergarten_region(self):
        """
        Возвращает регион детского сада или '—' если не найден.
        """
        kindergarten = self.get_kindergarten()
        return kindergarten.region.name if (kindergarten and kindergarten.region) else '—'

    get_kindergarten_region.short_description = 'Регион'

    def get_kindergarten_locality(self):
        """
        Возвращает город детского сада или '—' если не найден.
        """
        kindergarten = self.get_kindergarten()
        return kindergarten.locality if (kindergarten and kindergarten.locality) else '—'

    get_kindergarten_locality.short_description = 'Город'

    ongoing.fget.short_description = "Сейчас активна"
    ongoing.fget.boolean = True

    def save(self, *args, **kwargs):
        # Если связана тема фотосессии, копируем её имя в поле name
        if self.photo_theme_name:
            self.name = self.photo_theme_name.name

        super().save(*args, **kwargs)


class PhotoPopularityStat(PhotoTheme):
    class Meta:
        proxy = True
        verbose_name = 'Статистика популярности фотографий'
        verbose_name_plural = 'Статистики популярности фотографий'
