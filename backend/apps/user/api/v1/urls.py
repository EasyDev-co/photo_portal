from django.urls import path, include

from apps.user.api.v1.views import UserAPIView, ManagerBonusAPIView

urlpatterns = [
    path('parent/', include('apps.user.api.v1.parent.urls')),
    path('user/', UserAPIView.as_view(), name='user'),
    path('manager_bonus/', ManagerBonusAPIView.as_view(), name='manager_bonus'),
]
