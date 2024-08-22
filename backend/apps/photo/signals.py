from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.photo.models import PhotoTheme
from apps.photo.tasks import generate_promocodes_for_photo_theme


@receiver(post_save, sender=PhotoTheme)
def create_promocodes_for_new_photo_theme(sender, instance, created, **kwargs):
    """
    Сигнал для генерации промокодов для всех заведующих
    при создании новой фототемы.
    """

    if created:
        generate_promocodes_for_photo_theme.delay(instance.id)


