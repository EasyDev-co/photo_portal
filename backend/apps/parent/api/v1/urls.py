from django.urls import path

from apps.parent.api.v1.views import (ParentRegisterAPIView,
                                      ParentLoginAPIView,
                                      ParentLogoutAPIView)

urlpatterns = [
    path('register/', ParentRegisterAPIView.as_view(), name='parent_register'),
    path('login/', ParentLoginAPIView.as_view(), name='parent_login'),
    path('logout/', ParentLogoutAPIView.as_view(), name='parent_logout'),
]
