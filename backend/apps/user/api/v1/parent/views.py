from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


from apps.exceptions.api_exceptions import (
    MissingKindergartenCode,
    KindergartenCodeNotFound,
    InvalidCode,
    UserRegistered
)
from apps.kindergarten.models import Kindergarten
from apps.user.api.v1.serializers import UserSerializer
from apps.user.api.v1.parent.serializers import (
    EmailAndCodeSerializer,
    EmailSerializer,
    PasswordChangeSerializer
)

from apps.user.models import ConfirmCode
from apps.user.models.code import CodePurpose
from apps.user.models.email_error_log import EmailErrorLog
from apps.user.models.user import UserRole
from apps.user.tasks import send_confirm_code

from apps.utils.services.redis_client import redis_client

from loguru import logger

from apps.utils.services.generate_tokens_for_user import generate_tokens_for_user

User = get_user_model()


class ParentRegisterAPIView(CreateAPIView):
    """Представление для регистрации родителя."""
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        validate_data = serializer.validated_data
        password = validate_data.pop('password')
        kindergarten_code: str = validate_data.pop('kindergarten_code', None)

        if not kindergarten_code:
            raise MissingKindergartenCode
        try:
            kindergarten = Kindergarten.objects.get(code=kindergarten_code)
        except Kindergarten.DoesNotExist:
            raise KindergartenCodeNotFound

        with transaction.atomic():
            user = User.objects.filter(email=validate_data['email']).first()

            if not user:
                user = User.objects.create_user(
                    password=password,
                    **validate_data,
                )
                user.kindergarten.add(kindergarten)
                user.role = UserRole.parent
                user.save()

            if user.is_verified:
                raise UserRegistered

        code = self._generate_numeric_code()  # тут у вас может быть своя реализация

        confirm_code = ConfirmCode.objects.create(
            user=user,
            code=code,
            purpose=CodePurpose.CONFIRM_EMAIL,
        )

        error_log = EmailErrorLog.objects.create(
            confirm_code=confirm_code,
            user=user,
            message='Scheduled send confirm code',  # или пустая строка
            is_sent=False
        )

        send_confirm_code.delay(confirm_code_id=confirm_code.id)

        return user

    @staticmethod
    def _generate_numeric_code(length=6) -> str:
        # Здесь любая ваша логика генерации кода
        from random import randint
        code = randint(10**(length-1), 10**length - 1)
        return str(code)



class ParentLogoutAPIView(APIView):
    """Представление для логаута пользователя."""

    @swagger_auto_schema(responses={"205": openapi.Response(description="")})
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ConfirmCodeMixin:
    @classmethod
    def validate_code(cls, user, code, purpose):
        """Проверка кода родителя."""
        confirm_code = ConfirmCode.objects.filter(
            user=user,
            code=code,
            purpose=purpose,
            is_used=False,
        ).first()

        if not confirm_code or confirm_code.is_expired:
            raise InvalidCode


class EmailVerificationCodeAPIView(ConfirmCodeMixin, APIView):
    """Представление для верификации кода при регистрации родителя."""
    email_serializer = EmailAndCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.email_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        user = User.objects.get(email=email)

        try:
            self.validate_code(
                user=user,
                code=code,
                purpose=CodePurpose.CONFIRM_EMAIL,
            )
        except InvalidCode:
            return Response(
                {'message': InvalidCode.default_detail},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            user.is_verified = True
            user.save()

            ConfirmCode.objects.filter(code=code).update(is_used=True)

        tokens_dict = generate_tokens_for_user(user)
        return Response(
            {
                'user': str(user.id),
                'refresh': tokens_dict['refresh'],
                'access': tokens_dict['access']
            }, status=status.HTTP_201_CREATED
        )


class ResetPasswordAPIView(APIView):
    """Представление для восстановления пароля."""
    email_serializer = EmailSerializer

    @swagger_auto_schema(responses={"200": openapi.Response(description="")},
                         request_body=EmailSerializer)
    def post(self, request, *args, **kwargs):
        serializer = self.email_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = User.objects.get(email=email)
        logger.info("send code to reset password")
        send_confirm_code.delay(
            user_id=user.pk,
            code_purpose=CodePurpose.RESET_PASSWORD,
        )

        return Response(
            data={"message": "Код для восстановления пароля был отправлен на указанный email."},
            status=status.HTTP_200_OK
        )


class ResetPasswordVerificationCodeAPIView(ConfirmCodeMixin, APIView):
    """Представление для верификации кода восстановления пароля."""
    email_serializer = EmailAndCodeSerializer

    @swagger_auto_schema(responses={"200": openapi.Response(description="")},
                         request_body=EmailAndCodeSerializer)
    def post(self, request, *args, **kwargs):
        serializer = self.email_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        user = User.objects.get(email=email)

        try:
            self.validate_code(
                user=user,
                code=code,
                purpose=CodePurpose.RESET_PASSWORD,
            )
        except InvalidCode:
            return Response(
                {'message': InvalidCode.default_detail},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Код верифицирован. Можете сменить пароль."},
            status=status.HTTP_200_OK
        )


class PasswordChangeAPIView(ConfirmCodeMixin, APIView):
    """Представление для смены пароля пользователя."""
    password_change_serializer = PasswordChangeSerializer

    @swagger_auto_schema(responses={"200": openapi.Response(description="")},
                         request_body=PasswordChangeSerializer)
    def post(self, request, *args, **kwargs):
        serializer = self.password_change_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']
        code = request.data.get('code')
        user = User.objects.get(email=email)

        self.validate_code(
            user=user,
            code=code,
            purpose=CodePurpose.RESET_PASSWORD,
        )

        with transaction.atomic():
            user.password = make_password(new_password)
            user.save()

            ConfirmCode.objects.filter(code=code).update(is_used=True)

        return Response(
            {"message": "Пароль успешно изменен."},
            status=status.HTTP_200_OK
        )

class RetryEmailCodeAPIView(APIView):
    """Представление для восстановления пароля."""
    email_serializer = EmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.email_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        email_in_redis = redis_client.get(email)

        if email_in_redis:
            return Response(
                {"message": "Превыше временной лимит запроса кода"}, status=status.HTTP_400_BAD_REQUEST
            )

        redis_client.set(key=email, value=email, ex=60)

        user = User.objects.filter(email=email).first()

        send_confirm_code.delay(
            user_id=user.pk,
            code_purpose=CodePurpose.CONFIRM_EMAIL
        )
        return Response({"message": "Код повторно отправлен"}, status=status.HTTP_200_OK)
