from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from apps_crm.registration.api.v1.serializers import EmployeeTokenObtainPairSerializer
from apps_crm.registration.services import UserService


class UserCreateView(APIView):
    """Представление для создания сотрудников."""

    permission_classes = [IsAdminUser]

    def post(self, request):
        data = request.data

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        role_name = data.get('role')
        region_name = data.get('region')
        logged_in_user_id = request.user.id

        if not all([first_name, last_name, email, role_name, region_name]):
            return Response({"error": "Пожалуйста, предоставьте все необходимые поля."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            UserService.create_user(
                first_name,
                last_name,
                email,
                role_name,
                region_name,
                logged_in_user_id
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Пользователь успешно создан!"}, status=status.HTTP_201_CREATED)


class UserLoginAPIView(TokenObtainPairView):
    """Представление для авторизации пользователя."""

    serializer_class = EmployeeTokenObtainPairSerializer
