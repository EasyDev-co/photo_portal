from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission

from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import Photo
from apps.user.models.user import UserRole

User = get_user_model()


class HasPermissionCanViewPhotoLine(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == UserRole.parent:
            parent_kindergartens = user.kindergarten

            for kindergarten_id in parent_kindergartens.values('id'):
                if kindergarten_id['id'] == obj.kindergarten.pk:
                    return True
            return False


class IsPhotoPurchased(BasePermission):
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

