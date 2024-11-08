import django_filters

from apps_crm.client_cards.models import ClientCardTask, HistoryCall, Notes, ClientCard


class ClientCardTaskFilter(django_filters.FilterSet):
    class Meta:
        model = ClientCardTask
        fields = {
            'client_card': ['exact'],
            'task_status': ['exact', 'in'],
        }


class ClientCardFilter(django_filters.FilterSet):
    class Meta:
        model = ClientCard
        fields = {
            'kindergarten': ['exact'],
            'status': ['exact'],
            'modified': ['exact', 'date', 'date__range'],
        }


class HistoryCallFilter(django_filters.FilterSet):
    class Meta:
        model = HistoryCall
        fields = {
            'client_card': ['exact'],
            'call_status': ['exact', 'in'],
        }


class NotesFilter(django_filters.FilterSet):
    class Meta:
        model = Notes
        fields = {
            'client_card': ['exact'],
            'priority': ['exact'],
        }


class ClientCardTaskFilterV2(django_filters.FilterSet):
    executor = django_filters.NumberFilter(field_name='executor__id', lookup_expr='exact')
    date_end = django_filters.DateFilter(field_name='date_end', lookup_expr='exact')
    task_status = django_filters.NumberFilter(field_name='task_status', lookup_expr='exact')
    task_type = django_filters.NumberFilter(field_name='task_type', lookup_expr='exact')

    class Meta:
        model = ClientCardTask
        fields = ['executor', 'date_end', 'task_status', 'task_type']