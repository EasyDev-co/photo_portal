import logging

from rest_framework import permissions

from apps.user.models.user import UserRole


class IsManager(permissions.BasePermission):
    """
    Пермишен, который позволяет доступ только заведующим детского сада.
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.role == UserRole.manager

