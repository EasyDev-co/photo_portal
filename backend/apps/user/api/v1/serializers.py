from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.user.models import User


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
            'promocode',
            'is_verified'

        )
        extra_kwargs = {
            'password': {'write_only': True}
        }
