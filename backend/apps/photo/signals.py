from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.photo.models import PhotoTheme, Season, PhotoLine
from apps.photo.tasks import generate_promocodes_for_photo_theme
from apps.utils.services.season_matcher import get_season


# @receiver(post_save, sender=PhotoTheme)
# def create_promocodes_for_new_photo_theme(sender, instance, created, **kwargs):
#     """
#     Сигнал для генерации промокодов для всех заведующих
#     при создании новой фототемы.
#     """
#
#     if created:
#         generate_promocodes_for_photo_theme.delay(instance.id)


@receiver(post_save, sender=PhotoTheme)
def set_season(sender, instance, created, **kwargs):
    if created:
        season = get_season(instance.name)
        if season:
            instance.season = Season.objects.get(season=season)
            instance.save()
