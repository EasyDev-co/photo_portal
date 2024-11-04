from rest_framework.permissions import BasePermission
from .models import UserRole


class IsROPorDirector(BasePermission):
    """
    Разрешает доступ только ROP или Директору
    """

    def has_permission(self, request, view):
        employee = getattr(request.user, 'employee', None)
        if employee:
            return employee.employee_role in [UserRole.ROP, UserRole.CEO]
        return False


class IsEmployee(BasePermission):
    """
    Разрешает доступ сотрудникам.
    """

    def has_permission(self, request, view):
        employee = getattr(request.user, 'employee', None)
        if employee:
            return True
        return False


class IsAuthorOrROPorDirector(BasePermission):
    """
    Разрешает доступ автору ROP или Директору
    """

    def has_object_permission(self, request, view, obj):
        employee = getattr(request.user, 'employee', None)
        if not employee:
            return False
        return obj.author == employee or employee.employee_role in [UserRole.ROP, UserRole.CEO]
