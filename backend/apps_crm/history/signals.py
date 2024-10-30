from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps_crm.client_cards.models import ClientCard
from apps_crm.history.models import ManagerChangeLog


@receiver(pre_save, sender=ClientCard)
def log_manager_change(sender, instance, **kwargs):
    if not instance.pk:
        # Новая запись
        return
    try:
        old_instance = ClientCard.objects.get(pk=instance.pk)
    except ClientCard.DoesNotExist:
        return
    if old_instance.responsible_manager != instance.responsible_manager:
        ManagerChangeLog.objects.create(
            client_card=instance,
            previous_manager=old_instance.responsible_manager,
            new_manager=instance.responsible_manager,
        )
