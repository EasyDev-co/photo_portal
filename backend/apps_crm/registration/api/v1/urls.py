from django.urls import path
from apps_crm.registration.api.v1.views import UserCreateView, UserLoginView

urlpatterns = [
    path('create-user/', UserCreateView.as_view(), name='create-user'),
    path('login/', UserLoginView.as_view(), name='user-login'),
]