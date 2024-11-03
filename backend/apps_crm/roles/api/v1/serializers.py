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
        fields = ['id', 'email', 'first_name', 'second_name', 'last_name', 'role', 'phone_number', 'birth_date']


class EmployeeAndUserSerializer(serializers.ModelSerializer):
    user = UserSerializerCRM()

    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_role', 'status']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
