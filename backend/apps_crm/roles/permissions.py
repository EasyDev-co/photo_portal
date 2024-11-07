from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission
from apps_crm.roles.models import UserRole, Employee


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


class IsAuthorizedToEditTask(BasePermission):
    """
    Разрешение для проверки прав на редактирование задачи в зависимости от роли пользователя:
    - MANAGER может редактировать только свои задачи и только поля text и task_status.
    - SENIOR_MANAGER может редактировать свои задачи и задачи подчинённых менеджеров, но если
      у него стоит can_edit_task, то он может редактировать всю задачу.
    - CEO и ROP имеют полный доступ к редактированию всех задач.
    """

    def has_object_permission(self, request, view, obj):
        employee = get_object_or_404(Employee, user=request.user)

        # Если роль - MANAGER, проверка на доступ к редактированию только своих задач и только полей text и task_status
        if employee.employee_role == UserRole.MANAGER:
            # MANAGER может редактировать только свои задачи
            return obj.executor == employee

        # Если роль - SENIOR_MANAGER, проверка прав редактировать задачи подчинённых или всех задач при флаге can_edit_task
        elif employee.employee_role == UserRole.SENIOR_MANAGER:
            # Если SENIOR_MANAGER имеет право редактировать все задачи
            if employee.can_edit_task:
                return True
            # SENIOR_MANAGER может редактировать свои задачи и задачи менеджеров, прикрепленных к нему
            return obj.executor == employee or obj.executor.manager == employee

        # CEO и ROP имеют полный доступ к редактированию
        return employee.employee_role in [UserRole.CEO, UserRole.ROP]
