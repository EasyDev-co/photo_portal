import logging

from rest_framework import permissions

from apps.user.models.user import UserRole


class IsKindergartenManager(permissions.BasePermission):
    """
    Пермишен, который позволяет доступ только заведующим детского сада.
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == UserRole.manager:
            kindergarten_id = view.kwargs.get('pk')
            if kindergarten_id:
                return request.user.kindergarten.filter(id=kindergarten_id).exists()
        return False
