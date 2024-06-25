# from django.contrib.auth.hashers import make_password
# from django.db import transaction
# from drf_yasg.utils import swagger_auto_schema
# from rest_framework.generics import CreateAPIView
# from rest_framework.views import APIView
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.response import Response
# from rest_framework import status
# from drf_yasg import openapi
#
# from apps.exceptions.api_exceptions import (MissingKindergartenCode,
#                                             KindergartenCodeNotFound,
#                                             InvalidCode)
# from apps.kindergarten.models import Kindergarten
# from apps.parent.api.v1.serializers import (EmailAndCodeSerializer,
#                                             ParentTokenObtainPairSerializer,
#                                             EmailSerializer,
#                                             PasswordChangeSerializer)
# from apps.parent.models import ConfirmCode
# from apps.parent.models.code import CodePurpose
# from apps.parent.models.parent import Parent
# from apps.parent.tasks import send_confirm_code
# from apps.user.api.v1.serializers import UserSerializer
# from apps.user.models import User
# from apps.user.models.user import UserRole


# class ParentRegisterAPIView(CreateAPIView):
#     """
#     View для регистрации родителя.
#     """
#     serializer_class = UserSerializer
#
#     def perform_create(self, serializer):
#         validated_data = serializer.validated_data
#         password = validated_data.pop('password')
#         kindergarten_code: str = validated_data.pop('kindergarten_code', None)
#
#         if not kindergarten_code:
#             raise MissingKindergartenCode
#         try:
#             kindergarten = Kindergarten.objects.get(code=kindergarten_code)
#         except Kindergarten.DoesNotExist:
#             raise KindergartenCodeNotFound
#
#         with transaction.atomic():
#             user = User.objects.create_user(
#                 password=password,
#                 **validated_data
#             )
#
#             parent = Parent.objects.create(user=user)
#             parent.kindergarten.add(kindergarten)
#             user.role = UserRole.parent
#             user.save()
#
#         send_confirm_code.delay(
#             user_id=user.pk,
#             code_purpose=CodePurpose.CONFIRM_EMAIL
#         )
#         return user


# class ParentLoginAPIView(TokenObtainPairView):
#     """
#     View для авторизации пользователя.
#     """
#     serializer_class = ParentTokenObtainPairSerializer


# class ParentLogoutAPIView(APIView):
#     """
#     View для логаута пользователя.
#     """
#
#     @swagger_auto_schema(responses={"205": openapi.Response(description="")})
#     def post(self, request):
#         try:
#             refresh_token = request.data.get("refresh")
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response(
#                 {'message': str(e)},
#                 status=status.HTTP_400_BAD_REQUEST
#             )


# class ConfirmCodeMixin:
#
#     @classmethod
#     def validate_code(cls, parent, code, purpose):
#         """
#         Проверяет код для родителя.
#         """
#         confirm_code = ConfirmCode.objects.filter(
#             parent=parent,
#             code=code,
#             purpose=purpose,
#             is_used=False
#         ).first()
#
#         if not confirm_code or confirm_code.is_expired:
#             raise InvalidCode


# class EmailVerificationCodeAPIView(ConfirmCodeMixin, APIView):
#     """
#     View для верификации кода при регистрации родителя.
#     """
#     email_serializer = EmailAndCodeSerializer
#
#     def post(self, request, *args, **kwargs):
#         serializer = self.email_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         email = serializer.validated_data['email']
#         code = serializer.validated_data['code']
#         parent = Parent.objects.get(user__email=email)
#
#         try:
#             self.validate_code(
#                 parent=parent,
#                 code=code,
#                 purpose=CodePurpose.CONFIRM_EMAIL
#             )
#         except InvalidCode:
#             return Response(
#                 {'message': InvalidCode.default_detail},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#
#         with transaction.atomic():
#             parent.is_verified = True
#             parent.save()
#
#             ConfirmCode.objects.filter(code=code).update(is_used=True)
#
#         refresh_token = RefreshToken.for_user(parent.user)
#
#         return Response(
#             {
#                 'refresh': str(refresh_token),
#                 'access': str(refresh_token.access_token)
#             }, status=status.HTTP_201_CREATED
#         )


# class ResetPasswordAPIView(APIView):
#     """
#     View для восстановления пароля.
#     """
#     email_serializer = EmailSerializer
#
#     @swagger_auto_schema(responses={"200": openapi.Response(description="")},
#                          request_body=EmailSerializer)
#     def post(self, request, *args, **kwargs):
#         serializer = self.email_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         email = serializer.validated_data['email']
#
#         user = User.objects.get(email=email)
#
#         send_confirm_code.delay(
#             user_id=user.pk,
#             code_purpose=CodePurpose.RESET_PASSWORD,
#         )
#
#         return Response(
#             data={"message": "Код для восстановления пароля был отправлен на указанный email."},
#             status=status.HTTP_200_OK
#         )


# class ResetPasswordVerificationCodeAPIView(ConfirmCodeMixin, APIView):
#     """
#     View для верификации кода восстановления пароля.
#     """
#     email_serializer = EmailSerializer
#
#     @swagger_auto_schema(responses={"200": openapi.Response(description="")},
#                          request_body=EmailAndCodeSerializer)
#     def post(self, request, *args, **kwargs):
#         serializer = self.email_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         email = serializer.validated_data['email']
#         code = serializer.validated_data['code']
#         parent = Parent.objects.get(user__email=email)
#
#         try:
#             self.validate_code(
#                 parent=parent,
#                 code=code,
#                 purpose=CodePurpose.RESET_PASSWORD
#             )
#         except InvalidCode:
#             return Response(
#                 {'message': InvalidCode.default_detail},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#
#         return Response(
#             {"message": "Код верифицирован. Можете сменить пароль."},
#             status=status.HTTP_200_OK
#         )
# class PasswordChangeAPIView(ConfirmCodeMixin, APIView):
#     """
#     View для смены пароля пользователя.
#     """
#     password_change_serializer = PasswordChangeSerializer
#
#     @swagger_auto_schema(responses={"200": openapi.Response(description="")},
#                          request_body=PasswordChangeSerializer)
#     def post(self, request, *args, **kwargs):
#         serializer = self.password_change_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#
#         email = serializer.validated_data['email']
#         new_password = serializer.validated_data['new_password']
#         code = request.data.get('code')
#         parent = Parent.objects.get(user__email=email)
#
#         self.validate_code(
#             parent=parent,
#             code=code,
#             purpose=CodePurpose.RESET_PASSWORD
#         )
#         with transaction.atomic():
#             parent.user.password = make_password(new_password)
#             parent.user.save()
#
#             ConfirmCode.objects.filter(code=code).update(is_used=True)
#
#         return Response(
#             {"message": "Пароль успешно изменен."},
#             status=status.HTTP_200_OK
#         )
