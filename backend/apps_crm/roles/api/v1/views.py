from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from apps_crm.roles.permissions import IsROPorDirector
from apps_crm.roles.models import Employee
from apps_crm.roles.api.v1.serializers import EmployeeSerializer, EmployeeAndUserSerializer


class EmployeeSearchView(generics.ListAPIView):
    """
    API для поиска сотрудников по имени и фамилии.
    """
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Employee.objects.select_related('user')
        first_name = self.request.query_params.get('first_name', None)
        last_name = self.request.query_params.get('last_name', None)

        query = Q()
        if first_name:
            query &= Q(user__first_name__icontains=first_name)
        if last_name:
            query &= Q(user__last_name__icontains=last_name)

        if query:
            queryset = queryset.filter(query)

        return queryset


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeAndUserSerializer
    permission_classes = [IsAuthenticated, IsROPorDirector]

    def perform_create(self, serializer):
        serializer.save()
