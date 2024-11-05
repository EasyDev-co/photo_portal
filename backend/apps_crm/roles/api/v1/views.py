from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from apps_crm.roles.permissions import IsROPorDirector
from apps_crm.roles.models import Employee
from apps_crm.roles.api.v1.serializers import EmployeeSerializer, EmployeeAndUserSerializer


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
