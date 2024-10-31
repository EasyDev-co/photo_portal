from django.urls import path
from .views import EmployeeSearchView

urlpatterns = [
    path('employees/search/', EmployeeSearchView.as_view(), name='employee-search'),
]
