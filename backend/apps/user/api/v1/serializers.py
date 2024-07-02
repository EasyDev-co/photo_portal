from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from django.contrib.auth.password_validation import validate_password

from apps.user.models import User
from apps.user.models.user import UserRole


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

        refresh = RefreshToken.for_user(user)

        refresh['id'] = str(user.id)
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

    # role = serializers.CharField(source='get_role_display')

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
            'promocode',
            'is_verified'

        )
        extra_kwargs = {
            'password': {'write_only': True}
        }
