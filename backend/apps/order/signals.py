from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from apps.order.models import Order, OrderItem
from apps.order.models.const import OrderStatus
from apps.order.tasks import digital_photos_notification


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


@receiver(pre_save, sender=Order, dispatch_uid='digital_order_is_completed')
def digital_order_is_completed(sender, instance, **kwargs):
    """
    Сигнал для отправки уведомления о готовности электронных фото.
    Срабатывает, когда заказу устанавливается статус digital_order_is_completed.
    """
    if instance.id:
        old_instance = Order.objects.get(id=instance.id)
        if instance.status == OrderStatus.digital_order_is_completed and instance.status != old_instance.status:
            user_id = instance.user.id
            digital_photos_notification.delay(user_id=user_id)
