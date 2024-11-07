from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ClientCardTaskViewSet

router = DefaultRouter()
router.register(r'tasks', ClientCardTaskViewSet, basename='clientcardtask')

urlpatterns = [
    path('', include(router.urls)),
]