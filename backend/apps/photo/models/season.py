from django.db import models


class Seasons(models.IntegerChoices):
    """ Сезоны """
    WINTER = 1, 'Зима'
    SPRING = 2, 'Весна'
    SUMMER = 3, 'Лето'
    AUTUMN = 4, 'Осень'


class Season(models.Model):
    season = models.PositiveSmallIntegerField(
        choices=Seasons.choices,
        default=Seasons.WINTER,
        verbose_name='Сезон'
    )

    def __str__(self):
        return self.get_season_display()

    class Meta:
        verbose_name = "Сезон"
        verbose_name_plural = "Сезоны"
