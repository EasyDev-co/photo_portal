from django.db import models


class Seasons(models.IntegerChoices):
    """ Сезоны """
    WINTER = 1, 'Зима'
    SPRING = 2, 'Весна'
    SUMMER = 3, 'Лето'
    AUTUMN = 4, 'Осень'


class Season(models.Model):
    season = models.CharField(verbose_name="Сезон", max_length=50)

    def __str__(self):
        return self.season

    class Meta:
        verbose_name = "Сезон"
        verbose_name_plural = "Сезоны"
