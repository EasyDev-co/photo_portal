from django_filters import rest_framework as filters
from apps.photo.models.photo_theme import PhotoTheme


class PhotoThemeFilter(filters.FilterSet):
    date_start = filters.DateFilter(field_name='date_start', lookup_expr='gte')
    date_end = filters.DateFilter(field_name='date_end', lookup_expr='lte')

    class Meta:
        model = PhotoTheme
        fields = ['date_start', 'date_end']
