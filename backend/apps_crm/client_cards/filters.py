import django_filters
from .models import ClientCardTask, HistoryCall, Notes, ClientCard


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
