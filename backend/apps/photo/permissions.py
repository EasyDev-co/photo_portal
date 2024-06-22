from rest_framework.permissions import BasePermission

from apps.parent.models import Parent
from apps.user.models.user import UserRole


class HasPermissionCanViewPhotoLine(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == UserRole.parent:
            parent_kindergartens = user.parent.kindergarten

            for kindergarten_id in parent_kindergartens.values('id'):
                if kindergarten_id['id'] == obj.kindergarten.pk:
                    return True
            return False
