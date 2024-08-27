from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.exceptions.api_exceptions import UserNotFound
from apps.user.models import User


class EmailSerializer(serializers.Serializer):
    """Сериализатор для проверки email."""
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise UserNotFound
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
