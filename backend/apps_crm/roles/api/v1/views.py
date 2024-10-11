from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from apps_crm.roles.models import (
    Department, Region, Role, Permission
)
from apps_crm.roles.api.v1.serializers import (
    DepartmentSerializer,
    RegionSerializer,
    RoleSerializer,
    PermissionSerializer
)


class RegionViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления регионами (CRUD операции)."""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAdminUser]


class DepartmentViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления отделами (CRUD операции)."""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]


class PermissionViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления правами (CRUD операции)."""
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminUser]


class RoleViewSet(viewsets.ModelViewSet):
    """
    Вьюсет для управления ролями (CRUD операции).
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]
