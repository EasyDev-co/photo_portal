from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from apps.order.models import OrderItem


@receiver(post_save, sender=OrderItem)
def update_order_price(sender, instance, **kwargs):
    """
    Сигнал для пересчета цены после добавления или обновления OrderItem.
    """
    instance.order.update_order_price()


@receiver(post_delete, sender=OrderItem)
def delete_order_price(sender, instance, **kwargs):
    """
    Сигнал для пересчета цены после удаления OrderItem.
    """
    instance.order.update_order_price()
