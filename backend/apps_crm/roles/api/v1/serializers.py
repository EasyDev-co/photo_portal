from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from apps_crm.roles.models import Employee
from apps_crm.roles.models import User


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ["id", "full_name", "employee_role", "status"]

    def get_full_name(self, obj):
        return obj.user.full_name


class UserSerializerCRM(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'second_name', 'last_name', 'role', 'phone_number', 'birth_date', 'password'
        ]


class EmployeeAndUserSerializer(serializers.ModelSerializer):
    user = UserSerializerCRM()

    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_role', 'status']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        password = user_data.pop('password', None)
        if password:
            user_data['password'] = make_password(password)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee


class EmployeeWithoutSinorManagerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'full_name', 'status', 'employee_role']

    def get_full_name(self, obj):
        """Возвращает полное имя, объединяя first_name и last_name пользователя"""
        return f"{obj.user.first_name} {obj.user.last_name}"
