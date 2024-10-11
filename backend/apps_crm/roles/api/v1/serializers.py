from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps_crm.roles.models import Role, Department


class RoleSerializer(serializers.ModelSerializer):
    """Сериалайзер ролей."""

    department_name = serializers.CharField(
        source='department.name', required=True
    )
    parent_role_name = serializers.CharField(
        source='parent_role.name', allow_blank=True, required=False
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'department_name', 'parent_role_name']

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def get_parent_role_name(self, obj):
        return obj.parent_role.name if obj.parent_role else None

    def create(self, validated_data):

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
                department=department, parent_role=parent_role, **validated_data
            )
        except IntegrityError:
            raise ValidationError(
                f"Роль с именем '{validated_data['name']}' уже существует."
            )
        return role

    def update(self, instance, validated_data):

        department_name = validated_data.get('department', {}).get('name', None)
        parent_role_name = validated_data.get('parent_role', {}).get('name', None)

        if department_name:
            try:
                department = Department.objects.get(name=department_name)
                instance.department = department
            except Department.DoesNotExist:
                raise ValidationError(
                    f"Отдел с именем '{department_name}' не найден."
                )

        if parent_role_name:
            try:
                parent_role = Role.objects.get(name=parent_role_name)
                instance.parent_role = parent_role
            except Role.DoesNotExist:
                raise ValidationError(
                    f"Родительская роль с именем '{parent_role_name}' не найдена."
                )

        instance.name = validated_data.get('name', instance.name)

        instance.save()
        return instance
