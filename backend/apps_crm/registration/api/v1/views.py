from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps_crm.registration.services import UserService


class UserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        data = request.data

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        role_name = data.get('role')
        region_name = data.get('region')
        logged_in_user_id = request.user.id

        if not all([first_name, last_name, role_name, region_name]):
            return Response({"error": "Пожалуйста, предоставьте все необходимые поля."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Используем сервис для создания пользователя
        UserService.create_user(
            first_name,
            last_name,
            role_name,
            region_name,
            logged_in_user_id
        )

        return Response({"message": "Пользователь успешно создан!"}, status=status.HTTP_201_CREATED)
    

class UserLoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return Response({"error": "Пожалуйста, предоставьте логин и пароль."},
                            status=status.HTTP_400_BAD_REQUEST)

        print(f"Пытаюсь авторизовать пользователя: {username}")  # Логирование для отладки

        user = authenticate(request, username=username, password=password)

        if user is not None:
            return Response({"message": "Успешная авторизация."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Неверный логин или пароль."}, status=status.HTTP_401_UNAUTHORIZED)
