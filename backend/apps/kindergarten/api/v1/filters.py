import django_filters as df

from apps.kindergarten.models import Kindergarten


class KindergartenFilter(df.FilterSet):
    """Фильтр для списка детских садов."""

    name = df.CharFilter(field_name='name', lookup_expr='istartswith')

    class Meta:
        model = Kindergarten
        fields = ['name']
