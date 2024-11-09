from django.db.models.signals import post_save
from django.dispatch import receiver
from apps_crm.client_cards.models import ClientCardTask
from apps_crm.notifications.models import Notification


@receiver(post_save, sender=ClientCardTask)
def create_or_update_notification(sender, instance: ClientCardTask, created: bool, **kwargs):
    """
    Создает уведомление для исполнителя задачи при создании или изменении поля executor.
    """
    # Проверка на наличие исполнителя
    if instance.executor and instance.executor.user:
        # Формируем текст уведомления

        if instance.client_card:
            message = f"Задача по КК: http://http://0.0.0.0:3000/crm/kindergartens/{instance.client_card.id}/"
        else:
            message = f"""
                      {instance.get_task_type_display()}
                      {instance.text}
                      """

        # Если запись создана
        if created:
            # Создаем уведомление для нового исполнителя
            Notification.objects.create(
                user=instance.executor.user,
                sender=instance.author.user if instance.author and instance.author.user else None,
                message=message,
                is_read=False,
                url=""
            )
        else:
            # Проверяем изменение исполнителя
            old_instance = ClientCardTask.objects.get(pk=instance.pk)
            if old_instance.executor != instance.executor:
                # Создаем уведомление для нового исполнителя
                Notification.objects.create(
                    user=instance.executor.user,
                    sender=instance.author.user if instance.author and instance.author.user else None,
                    message=message,
                    is_read=False,
                    url=""
                )
