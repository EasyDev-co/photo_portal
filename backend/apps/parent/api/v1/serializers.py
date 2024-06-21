from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers

from apps.exceptions.api_exceptions import ParentNotFound
from apps.parent.models import Parent
from apps.user.models import User
from apps.user.models.user import UserRole


class ParentTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Сериализатор для авторизации.
    """
    def validate(self, attrs):
        authenticate_kwargs = {
            'email': attrs['email'],
            'password': attrs['password'],
        }
        user = authenticate(**authenticate_kwargs)

        if user is None or not user.is_active:
            raise ValidationError('Нет такого пользователя.')

        refresh = RefreshToken.for_user(user)

        refresh['id'] = user.id
        refresh['email'] = user.email
        refresh['role'] = user.role

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class EmailSerializer(serializers.Serializer):
    """
    Сериализатор для проверки email.
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user or user.role != UserRole.parent:
            raise ParentNotFound
        return value


class EmailAndCodeSerializer(EmailSerializer):
    """
    Сериализатор для проверки кода.
    """
    code = serializers.CharField()


class PasswordChangeSerializer(EmailAndCodeSerializer):
    """
    Сериализатор для смены пароля.
    """
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
