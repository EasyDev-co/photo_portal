from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeSearchView, EmployeeViewSet, UnassignedManagersAPIView, AssignManagersAPIView


router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('employees/search/', EmployeeSearchView.as_view(), name='employee-search'),
    path('api/unassigned-managers/', UnassignedManagersAPIView.as_view(), name='unassigned-managers'),
    path('api/assign-managers/', AssignManagersAPIView.as_view(), name='assign-managers'),
    path('', include(router.urls)),
]
