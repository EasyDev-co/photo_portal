from django.core.validators import MinLengthValidator
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from phonenumber_field.serializerfields import PhoneNumberField

from apps.kindergarten.api.v1.serializers import KindergartenSerializer
from apps.photo.api.v1.serializers import PhotoThemeSerializer
from apps.photo.models import PhotoTheme
from apps.promocode.models import Promocode
from apps.user.models import User
from apps.user.models.manager_bonus import ManagerBonus
from apps.user.validators import validate_cyrillic
from apps_crm.roles.models import Employee


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Сериализатор для авторизации пользователя."""

    def validate(self, attrs):
        authenticate_kwargs = {
            'email': attrs['email'],
            'password': attrs['password'],
        }
        user = authenticate(**authenticate_kwargs)

        if user is None or not user.is_active:
            raise ValidationError('Нет такого пользователя.')
        if not user.is_verified:
            raise ValidationError('Email не подтвержден.')

        refresh = RefreshToken.for_user(user)
        refresh['email'] = user.email
        refresh['role'] = user.role

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели пользователя.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    kindergarten_code = serializers.CharField(max_length=255, required=False)

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'second_name',
            'last_name',
            'password',
            'role',
            'kindergarten_code',
            'is_verified'

        )
        extra_kwargs = {
            'password': {'write_only': True}
        }


class EmployeeSerializerForUser(serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Employee
        fields = (
            'employee_role',
            'status',
            'manager',
            'can_edit_task',
        )


class UserGetSerializer(serializers.ModelSerializer):
    """
    Сериализатор для просмотра модели пользователя.
    """
    kindergarten = KindergartenSerializer(read_only=True, many=True)
    managed_kindergarten = KindergartenSerializer(read_only=True, required=False)
    employee = EmployeeSerializerForUser(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'second_name',
            'last_name',
            'phone_number',
            'role',
            'kindergarten',
            'is_verified',
            'managed_kindergarten',
            'employee',
        )


class UserUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(
        max_length=56,
        required=False,
        validators=[validate_cyrillic, MinLengthValidator(2)]
    )
    second_name = serializers.CharField(
        max_length=56,
        required=False,
        validators=[validate_cyrillic, MinLengthValidator(2)]
    )
    last_name = serializers.CharField(
        max_length=56,
        required=False,
        validators=[validate_cyrillic, MinLengthValidator(2)]
    )
    email = serializers.EmailField(required=False)
    phone_number = PhoneNumberField(
        required=False,
        max_length=12
    )

    class Meta:
        model = User
        fields = (
            'first_name',
            'second_name',
            'last_name',
            'email',
            'phone_number'
        )


class ManagerBonusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для бонуса заведующей.
    """
    photo_theme = PhotoThemeSerializer(read_only=True)

    class Meta:
        model = ManagerBonus
        fields = (
            'id',
            'bonus_size',
            'total_bonus',
            'paid_for',
            'user',
            'photo_theme'
        )


class ManagerSerializer(UserSerializer):
    promocode = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + (
            'phone_number',
            'promocode',
            'birth_date'
        )

    def get_promocode(self, obj):
        photo_theme = PhotoTheme.objects.filter(
            photo_lines__in=obj.managed_kindergarten.photo_lines.all(),
            is_active=True
        ).distinct().first()
        promocode = Promocode.objects.filter(
            user=obj,
            is_active=True,
            photo_theme=photo_theme
        ).first()
        if promocode:
            return promocode.code
