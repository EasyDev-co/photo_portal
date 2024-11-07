from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response


from apps_crm.roles.permissions import IsROPorDirector
from apps_crm.roles.models import UserRole
from apps_crm.roles.models import Employee
from apps_crm.roles.api.v1.serializers import (
    EmployeeSerializer,
    EmployeeAndUserSerializer,
    EmployeeWithoutSinorManagerSerializer
)


class EmployeeSearchView(generics.ListAPIView):
    """
    API для поиска сотрудников по полному имени.
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Employee.objects.select_related('user')
        full_name = self.request.query_params.get('full_name', None)

        if full_name:
            name_parts = full_name.split()
            if len(name_parts) == 2:
                first_name, last_name = name_parts
                queryset = queryset.filter(
                    Q(user__first_name__icontains=first_name) &
                    Q(user__last_name__icontains=last_name)
                )
            elif len(name_parts) == 1:
                first_name = name_parts[0]
                queryset = queryset.filter(
                    Q(user__first_name__icontains=first_name) |
                    Q(user__last_name__icontains=first_name)
                )

        return queryset


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeAndUserSerializer
    permission_classes = [IsAuthenticated, IsROPorDirector]

    def perform_create(self, serializer):
        serializer.save()


class UnassignedManagersAPIView(APIView):
    permission_classes = [IsAuthenticated, IsROPorDirector]

    def get(self, request):
        full_name = request.query_params.get("full_name", "").strip()
        managers = Employee.objects.filter(
            employee_role=UserRole.MANAGER,
            manager__isnull=True
        )

        if full_name:
            managers = managers.filter(
                Q(user__first_name__icontains=full_name) | Q(user__last_name__icontains=full_name)
            )

        serializer = EmployeeWithoutSinorManagerSerializer(managers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssignManagersAPIView(APIView):
    permission_classes = [IsAuthenticated, IsROPorDirector]

    def post(self, request):
        """
        Привязывает список менеджеров (MANAGER) к супер-менеджеру (SENIOR_MANAGER).
        """
        manager_ids = request.data.get("manager_ids")
        senior_manager_id = request.data.get("senior_manager_id")

        if not manager_ids or not senior_manager_id:
            return Response(
                {"detail": "Поля manager_ids и senior_manager_id обязательны."},
                status=status.HTTP_400_BAD_REQUEST
            )

        senior_manager = get_object_or_404(Employee, id=senior_manager_id)

        if senior_manager.employee_role != UserRole.SENIOR_MANAGER:
            return Response(
                {"detail": "Выбранный супер-менеджер не является старшим менеджером."},
                status=status.HTTP_400_BAD_REQUEST
            )

        successful_assignments = []
        errors = []

        for manager_id in manager_ids:
            manager = get_object_or_404(Employee, id=manager_id)
            if manager.employee_role != UserRole.MANAGER:
                errors.append({"manager_id": manager_id, "detail": "Сотрудник не является менеджером."})
                continue

            if manager.manager is not None:
                errors.append(
                    {"manager_id": manager_id, "detail": "Менеджер уже привязан к другому старшему менеджеру."})
                continue

            manager.manager = senior_manager
            manager.save()
            successful_assignments.append(manager)

        serializer = EmployeeAndUserSerializer(successful_assignments, many=True)

        return Response({
            "assigned_managers": serializer.data,
            "errors": errors
        }, status=status.HTTP_200_OK)
