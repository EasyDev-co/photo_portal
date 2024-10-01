from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.api.v1.permissions import IsManager
from apps.user.api.v1.serializers import (
    UserTokenObtainPairSerializer,
    UserUpdateSerializer,
    UserGetSerializer,
    ManagerBonusSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

from apps.user.models import User
from apps.user.models.manager_bonus import ManagerBonus


class UserLoginAPIView(TokenObtainPairView):
    """Представление для авторизации пользователя."""
    serializer_class = UserTokenObtainPairSerializer


class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Получение детальной информации о пользователе."""
        instance = request.user
        user_data = User.objects.get(pk=instance.pk)
        user_serializer = UserGetSerializer(user_data)
        return Response(user_serializer.data)

    def patch(self, request, *args, **kwargs):
        """Изменение информации о пользователе."""
        instance = request.user
        serializer = UserUpdateSerializer(instance=instance, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    data=serializer.data,
                    status=status.HTTP_200_OK
                )
            except IntegrityError as e:
                error_message = str(e).lower()

                if 'email' in error_message:
                    error_data = {
                        "email": ["Адрес электронной почты недоступен"]}
                elif 'phone_number' in error_message:
                    error_data = {
                        "phone_number": ["Номер телефона недоступен"]}
                else:
                    error_data = {"message": "Произошла ошибка при сохранении"}

                return Response(
                    data=error_data,
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ManagerBonusAPIView(APIView):
    """
    Представление для получения бонуса заведующей детским садом.
    """
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        manager = request.user

        # извлекаем бонус заведующей за активные фототемы в детском саду
        manager_bonus_for_active_photo_themes = ManagerBonus.objects.filter(
            user=manager,
            photo_theme__is_active=True,
            photo_theme__photo_lines__kindergarten=manager.managed_kindergarten
        ).distinct()

        if not manager_bonus_for_active_photo_themes.exists():
            return Response(
                'У данного заведующего нет бонусов за активные фототемы.',
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ManagerBonusSerializer(
            manager_bonus_for_active_photo_themes,
            many=True
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)
