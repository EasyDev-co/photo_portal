from rest_framework import permissions

from apps_crm.roles.models import Employee


class HasRolePermission(permissions.BasePermission):
    """Пользовательское разрешение для проверки наличия нужного права у роли."""

    def __init__(self, required_permission):
        self.required_permission = required_permission

    def has_permission(self, request, view):
        # Проверяем, аутентифицирован ли пользователь
        if not request.user.is_authenticated:
            return False

        # Получаем сотрудника, связанного с пользователем
        try:
            employee = request.user.employee
            role = employee.role
            if role and role.permissions.filter(name=self.required_permission).exists():
                return True
        except Employee.DoesNotExist:
            return False

        return False
