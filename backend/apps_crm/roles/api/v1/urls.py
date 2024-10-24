from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps_crm.roles.api.v1.views import (
    DepartmentViewSet,
    RegionViewSet,
    RoleViewSet,
    PermissionViewSet
)

# router = DefaultRouter()
# router.register('roles', RoleViewSet, basename='roles')
# router.register('regions', RegionViewSet, basename='regions')
# router.register('departments', DepartmentViewSet, basename='departments')
# router.register('permissions', PermissionViewSet, basename='permissions')

# urlpatterns = [
#     path('', include(router.urls)),
# ]
