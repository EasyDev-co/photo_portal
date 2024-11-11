import django_filters

from apps_crm.client_cards.models import ClientCardTask, HistoryCall, Notes, ClientCard

class UUIDInFilter(django_filters.BaseInFilter, django_filters.UUIDFilter):
    ...

class ClientCardTaskFilter(django_filters.FilterSet):
    class Meta:
        model = ClientCardTask
        fields = {
            'client_card': ['exact'],
            'task_status': ['exact', 'in'],
        }


# TODO переделать фильтры от А-Я, Я-А
class ClientCardFilter(django_filters.FilterSet):
    responsible_manager = UUIDInFilter(field_name='responsible_manager__id', lookup_expr='in')
    region = UUIDInFilter(field_name='kindergarten__region__id', lookup_expr='in')
    ordering = django_filters.OrderingFilter(
        fields=(
            ('kindergarten__name', 'kindergarten_name'),
        ),
        field_labels={
            'kindergarten_name': 'Имя детского сада',
        },
    )

    class Meta:
        model = ClientCard
        fields = {
            'kindergarten': ['exact'],
            'status': ['exact'],
            'modified': ['exact', 'date', 'date__range'],
            'responsible_manager': ['exact'],
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
    executor = UUIDInFilter(field_name='executor__id', lookup_expr='in')
    date_end = django_filters.DateFilter(field_name='date_end', lookup_expr='exact')
    task_status = django_filters.NumberFilter(field_name='task_status', lookup_expr='exact')
    task_type = django_filters.NumberFilter(field_name='task_type', lookup_expr='exact')

    class Meta:
        model = ClientCardTask
        fields = ['executor', 'date_end', 'task_status', 'task_type']