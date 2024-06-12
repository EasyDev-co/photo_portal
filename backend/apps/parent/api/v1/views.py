from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

from apps.kindergarten.models import Kindergarten
from apps.parent.api.v1.serializers import ParentTokenObtainPairSerializer
from apps.parent.models.parent import Parent
from apps.user.api.v1.serializers import UserSerializer
from apps.user.models import User
from apps.user.models.user import UserRole


class ParentRegisterAPIView(CreateAPIView):
    """
    View для регистрации родителя.
    """
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        password = validated_data.pop('password')
        kindergarten_code: str = validated_data.pop('kindergarten_code', None)

        if not kindergarten_code:
            raise ValidationError({'message': "Код детского сада не указан."})
        try:
            kindergarten = Kindergarten.objects.get(code=kindergarten_code)
        except Kindergarten.DoesNotExist:
            raise ValidationError({'message': "Такого детского сада не существует."})

        with transaction.atomic():
            user = User.objects.create_user(
                password=password,
                **validated_data
            )

            parent = Parent.objects.create(user=user)
            parent.kindergarten.add(kindergarten)
            user.role = UserRole.parent
            user.save()

        return user


class ParentLoginAPIView(TokenObtainPairView):
    """
    View для авторизации пользователя.
    """
    serializer_class = ParentTokenObtainPairSerializer


class ParentLogoutAPIView(APIView):
    """
    View для логаута пользователя.
    """
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'message': str(e), 'status': status.HTTP_400_BAD_REQUEST})
