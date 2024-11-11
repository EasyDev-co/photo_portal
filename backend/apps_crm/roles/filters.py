import django_filters
from .models import Employee
from django_filters import rest_framework as filters

class EmployeeFilter(filters.FilterSet):
    ids = django_filters.CharFilter(method='filter_by_ids', label='List of UUIDs')

    class Meta:
        model = Employee
        fields = ['ids']

    def filter_by_ids(self, queryset, name, value):
        ids_list = value.split(',')
        return queryset.filter(id__in=ids_list)
