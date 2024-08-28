from rest_framework import permissions

from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import Photo


class IsPhotoPurchased(permissions.BasePermission):
    """
    Проверяет, куплена ли фотография.
    """

    def has_permission(self, request, view):
        photo_id = view.kwargs.get('photo_id')
        if not photo_id:
            return False

        photo = Photo.objects.filter(id=photo_id).first()
        if not photo:
            return False

        order_exists = Order.objects.filter(
            user=request.user,
            photo_line=photo.photo_line,
            status__in=[OrderStatus.completed, OrderStatus.paid_for]
        ).exists()

        return order_exists
