from rest_framework.permissions import BasePermission
from apps.user.models.user import UserRole


class IsParent(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == UserRole.parent
