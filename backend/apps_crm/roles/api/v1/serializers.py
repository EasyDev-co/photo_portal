from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps_crm.roles.models import (
    ClientCard, Role, Department, Region, Permission
)


class RegionSerializer(serializers.ModelSerializer):
    """Сериализатор для региона."""

    class Meta:
        model = Region
        fields = ['id', 'name']


class DepartmentSerializer(serializers.ModelSerializer):
    """Сериализатор для отдела."""

    class Meta:
        model = Department
        fields = ['id', 'name']


class PermissionSerializer(serializers.ModelSerializer):
    """Сериализатор для прав."""
    class Meta:
        model = Permission
        fields = ['id', 'name', 'description']


class RoleSerializer(serializers.ModelSerializer):
    """Сериалайзер ролей."""

    department_name = serializers.CharField(
        source='department.name', required=True
    )
    parent_role_name = serializers.CharField(
        source='parent_role.name', allow_blank=True, required=False
    )
    permissions_names = serializers.ListField(
        child=serializers.CharField(), required=False
    )

    class Meta:
        model = Role
        fields = [
            'id',
            'name',
            'department_name',
            'parent_role_name',
            'permissions_names'
        ]

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def get_parent_role_name(self, obj):
        return obj.parent_role.name if obj.parent_role else None

    def get_permissions_names(self, obj):
        return obj.permissions.values_list('name', flat=True)

    def create(self, validated_data):

        permissions_names = validated_data.pop('permissions_names', [])
        department_name = validated_data.pop('department')['name']
        parent_role_name = validated_data.pop('parent_role', None)['name']

        # Найти отдел по имени
        try:
            department = Department.objects.get(name=department_name)
        except Department.DoesNotExist:
            raise ValidationError(
                f"Отдел с именем '{department_name}' не найден."
            )

        # Найти родительскую роль по имени, если она указана
        parent_role = None
        if parent_role_name:
            try:
                parent_role = Role.objects.get(name=parent_role_name)
            except Role.DoesNotExist:
                raise ValidationError(
                    f"Родительская роль с именем '{parent_role_name}' не найдена."
                )

        # Создать новую роль
        try:
            role = Role.objects.create(
                department=department,
                parent_role=parent_role,
                **validated_data
            )
        except IntegrityError:
            raise ValidationError(
                f"Роль с именем '{validated_data['name']}' уже существует."
            )

        # Обработать список пермиссий
        for permission_name in permissions_names:
            permission, created = Permission.objects.get_or_create(
                name=permission_name
            )
            role.permissions.add(permission)

        return role

    def update(self, instance, validated_data):

        permissions_names = validated_data.pop('permissions_names', [])
        department_name = validated_data.get('department', {}).get('name', None)
        parent_role_name = validated_data.get('parent_role', {}).get('name', None)

        # Обработка обновления отдела
        if department_name:
            try:
                department = Department.objects.get(name=department_name)
                instance.department = department
            except Department.DoesNotExist:
                raise ValidationError(
                    f"Отдел с именем '{department_name}' не найден."
                )

        # Обработка обновления ролей
        if parent_role_name:
            try:
                parent_role = Role.objects.get(name=parent_role_name)
                instance.parent_role = parent_role
            except Role.DoesNotExist:
                raise ValidationError(
                    f"Родительская роль с именем '{parent_role_name}' не найдена."
                )

        instance.name = validated_data.get('name', instance.name)

        # Обработка обновления пермиссий
        instance.permissions.clear()
        for permission_name in permissions_names:
            permission, created = Permission.objects.get_or_create(
                name=permission_name
            )
            instance.permissions.add(permission)
            print(f"{'Created' if created else 'Retrieved'} permission: {permission.name}")

        instance.save()

        return instance

    def to_representation(self, instance):
        """Отобразить объект в виде словаря."""
        representation = super().to_representation(instance)
        representation['permissions_names'] = list(
            instance.permissions.values_list('name', flat=True)
        )
        return representation


class ClientCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientCard
        fields = ['id', 'client', 'responsible_manager', 'region']
