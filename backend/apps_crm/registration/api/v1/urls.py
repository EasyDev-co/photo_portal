from django.urls import path

from apps_crm.registration.api.v1.views import UserCreateView, UserLoginAPIView


urlpatterns = [
    path('create-user/', UserCreateView.as_view(), name='create-user'),
    path('login/', UserLoginAPIView.as_view(), name='user-login'),
]
