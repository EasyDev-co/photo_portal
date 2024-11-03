from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeSearchView, EmployeeViewSet


router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('employees/search/', EmployeeSearchView.as_view(), name='employee-search'),
    path('', include(router.urls)),
]
