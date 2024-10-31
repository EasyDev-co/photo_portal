from rest_framework import serializers

from apps_crm.roles.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ["id", "full_name", "employee_role", "status"]

    def get_full_name(self, obj):
        return obj.user.full_name
