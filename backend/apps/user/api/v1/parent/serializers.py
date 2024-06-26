from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

from apps.exceptions.api_exceptions import ParentNotFound
from apps.user.models import User
from apps.user.models.user import UserRole


class EmailSerializer(serializers.Serializer):
    """Сериализатор для проверки email."""
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user or user.role != UserRole.parent:
            raise ParentNotFound
        return value


class EmailAndCodeSerializer(EmailSerializer):
    """Сериализатор для проверки кода."""
    code = serializers.CharField()


class PasswordChangeSerializer(EmailAndCodeSerializer):
    """Сериализатор для смены пароля."""
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
