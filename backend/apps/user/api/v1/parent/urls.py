from django.urls import path

from apps.user.api.v1.parent.views import (ParentRegisterAPIView,
                                           ParentLoginAPIView,
                                           ParentLogoutAPIView,
                                           EmailVerificationCodeAPIView,
                                           ResetPasswordAPIView,
                                           ResetPasswordVerificationCodeAPIView,
                                           PasswordChangeAPIView
                                           )


urlpatterns = [
    path('register/', ParentRegisterAPIView.as_view(), name='parent_register'),
    path('login/', ParentLoginAPIView.as_view(), name='parent_login'),
    path('logout/', ParentLogoutAPIView.as_view(), name='parent_logout'),
    path('email_verification_code/', EmailVerificationCodeAPIView.as_view(), name='email_verification_code'),
    path('reset_password/', ResetPasswordAPIView.as_view(), name='reset_password'),
    path('verify_reset_code/', ResetPasswordVerificationCodeAPIView.as_view(), name='reset_password_code'),
    path('change_password/', PasswordChangeAPIView.as_view(), name='change_password'),
]