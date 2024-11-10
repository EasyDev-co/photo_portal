from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from apps_crm.roles.permissions import IsROPorDirector, IsAuthorizedToEditTask
from apps_crm.roles.models import Employee, UserRole
from apps_crm.client_cards.models import ClientCardTask
from apps_crm.client_cards.api.v2.serializers import ClientCardTaskReadSerializer, ClientCardTaskWriteSerializer
from apps_crm.client_cards.filters import ClientCardTaskFilterV2


class ClientCardTaskViewSet(viewsets.ModelViewSet):
    queryset = ClientCardTask.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardTaskFilterV2

    def get_serializer_class(self):
        # Используем сериализатор на запись для создания и редактирования
        if self.action in ['create', 'update', 'partial_update']:
            return ClientCardTaskWriteSerializer
        return ClientCardTaskReadSerializer

    def get_permissions(self):
        # Разные разрешения для разных действий
        if self.action in ['create', 'destroy']:
            self.permission_classes = [IsROPorDirector]
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [IsAuthorizedToEditTask]
        elif self.action == 'list':
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        employee = get_object_or_404(Employee, user=user)

        if employee.employee_role == UserRole.MANAGER:
            # MANAGER видит только свои задачи
            return ClientCardTask.objects.filter(executor=employee)
        elif employee.employee_role == UserRole.SENIOR_MANAGER:
            # SENIOR_MANAGER видит свои задачи и задачи своих менеджеров
            return ClientCardTask.objects.filter(
                Q(executor=employee) | Q(executor__manager=employee)
            )
        # CEO и ROP видят все задачи
        return ClientCardTask.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        employee = get_object_or_404(Employee, user=user)

        # Проверка на создание задачи только для CEO и ROP
        if employee.employee_role not in [UserRole.CEO, UserRole.ROP]:
            raise PermissionDenied("Создавать задачи могут только CEO и ROP.")
        serializer.save(author=employee)

    def perform_update(self, serializer):
        user = self.request.user
        employee = get_object_or_404(Employee, user=user)
        task = self.get_object()

        if employee.employee_role == UserRole.MANAGER:
            if task.executor != employee:
                raise PermissionDenied("Вы можете редактировать только свои задачи.")
            serializer.save(
                task_status=serializer.validated_data.get('task_status', task.task_status),
                text=serializer.validated_data.get('text', task.text)
            )
        elif employee.employee_role == UserRole.SENIOR_MANAGER:
            if task.executor == employee or employee.can_edit_task:
                serializer.save()
            else:
                serializer.save(
                    task_status=serializer.validated_data.get('task_status', task.task_status),
                    text=serializer.validated_data.get('text', task.text)
                )
        elif employee.employee_role in [UserRole.CEO, UserRole.ROP]:
            serializer.save()
        else:
            raise PermissionDenied("У вас нет прав для редактирования этой задачи.")

    def perform_destroy(self, instance):
        user = self.request.user
        employee = get_object_or_404(Employee, user=user)

        # Удаление доступно только для CEO и ROP
        if employee.employee_role not in [UserRole.CEO, UserRole.ROP]:
            raise PermissionDenied("Удалять задачи могут только CEO и ROP.")
        instance.delete()
