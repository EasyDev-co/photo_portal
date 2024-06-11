from django.urls import path

from apps.parent.api.v1.views import ParentRegisterAPIView

urlpatterns = [
    path('register/', ParentRegisterAPIView.as_view()),
]
