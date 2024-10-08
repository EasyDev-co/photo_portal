from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Employee, ClientCard


@receiver(post_save, sender=Employee)
def handle_employee_status_change(sender, instance, **kwargs):
    if instance.status == 'inactive':
        # Удаление менеджера
        ClientCard.objects.filter(
            responsible_manager=instance
        ).update(responsible_manager=None)
