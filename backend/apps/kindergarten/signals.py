from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.kindergarten.models import Region, PhotoPrice, PhotoType


@receiver(post_save, sender=Region)
def create_photoprice_for_region(sender, instance, created, **kwargs):
    """Сигнал для создания бесплатных айтемов для региона"""
    if created:
        with transaction.atomic():
            PhotoPrice.objects.create(
                region=instance,
                photo_type=PhotoType.free_calendar
            )
            PhotoPrice.objects.create(
                region=instance,
                photo_type=PhotoType.digital
            )
