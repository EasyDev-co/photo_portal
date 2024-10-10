from decimal import Decimal

from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from apps.order.models import Order, OrderItem
from apps.order.models.const import OrderStatus
from apps.order.tasks import digital_photos_notification
from apps.user.models.manager_bonus import ManagerBonus


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


@receiver(pre_save, sender=Order, dispatch_uid='order_is_paid')
def order_is_paid(sender, instance, **kwargs):
    """
    Сигнал для отправки уведомления о готовности электронных фото и начисления бонуса заведующей.
    Срабатывает, когда заказу устанавливается статус paid_for.
    """
    if instance.id:
        old_instance = Order.objects.get(id=instance.id)
        if instance.status == OrderStatus.paid_for and instance.status != old_instance.status:
            user_id = instance.user.id

            # отправка нотификации
            digital_photos_notification.delay(user_id=user_id)

            # достаем бонус заведующей для текущей фототемы
            bonus = ManagerBonus.objects.get(
                user=instance.photo_line.kindergarten.manager,
                photo_theme=instance.photo_line.photo_theme,
            )

            # считаем и сохраняем сумму бонуса заведующей с суммы заказа
            bonus.total_bonus = Decimal(
                instance.order_price * bonus.percentage
            )
            bonus.save()
