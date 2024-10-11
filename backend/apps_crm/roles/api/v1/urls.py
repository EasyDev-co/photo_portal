from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps_crm.roles.api.v1.views import RoleViewSet

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='roles')

urlpatterns = [
    path('', include(router.urls)),
]
