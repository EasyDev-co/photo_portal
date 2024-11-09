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
    password = serializers.CharField(write_only=True, required=False)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'second_name',
            'last_name',
            'role',
            'phone_number',
            'birth_date',
            'password',
            'is_active'
        ]


from django.contrib.auth.hashers import make_password


class UserSerializerCRM(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'second_name', 'last_name',
            'role', 'phone_number', 'birth_date', 'password', 'is_active'
        ]

    def update(self, instance, validated_data):
        # Обновляем пароль, если он передан
        password = validated_data.pop('password', None)
        if password:
            instance.password = make_password(password)

        # Обновляем остальные поля
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class EmployeeAndUserSerializer(serializers.ModelSerializer):
    user = UserSerializerCRM()
    employee_role_display = serializers.CharField(source='get_employee_role_display', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_role', 'employee_role_display', 'status']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password', None)

        if password:
            user_data['password'] = make_password(password)

        user = User.objects.create(**user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        if user_data:
            password = user_data.pop('password', None)
            if password and user.password != make_password(password):
                user.password = make_password(password)

            for attr, value in user_data.items():
                if getattr(user, attr) != value:
                    setattr(user, attr, value)

            user.save()

        for attr, value in validated_data.items():
            if getattr(instance, attr) != value:
                setattr(instance, attr, value)

        instance.save()
        return instance


class EmployeeWithoutSinorManagerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'full_name', 'status', 'employee_role']

    def get_full_name(self, obj):
        """Возвращает полное имя, объединяя first_name и last_name пользователя"""
        return f"{obj.user.first_name} {obj.user.last_name}"
