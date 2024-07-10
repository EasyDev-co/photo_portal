from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.user.api.v1.serializers import UserTokenObtainPairSerializer, UserUpdateSerializer, \
    UserGetSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

from apps.user.models import User


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
            except IntegrityError:
                return Response(
                    data={
                        'message': 'Адрес электронной почты недоступен'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
