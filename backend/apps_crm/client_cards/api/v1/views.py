from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

from apps_crm.client_cards.models import ClientCardTask, HistoryCall, Notes, ClientCard
from apps_crm.client_cards.api.v1.serializers import ClientCardTaskSerializer, HistoryCallSerializer, NotesSerializer, \
    ClientCardSerializer, ClientCardRetrieveSerializer
from apps_crm.roles.permissions import IsROPorDirector, IsAuthorOrROPorDirector
from apps_crm.client_cards.filters import ClientCardTaskFilter, HistoryCallFilter, NotesFilter, ClientCardFilter


class ClientCardPermissionMixin:
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsROPorDirector]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAuthorOrROPorDirector]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class ClientCardTaskViewSet(viewsets.ModelViewSet):
    queryset = ClientCardTask.objects.all()
    serializer_class = ClientCardTaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardTaskFilter


class ClientCardViewSet(viewsets.ModelViewSet):
    """ Вью для карточек клиента. """
    queryset = ClientCard.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardFilter

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientCardRetrieveSerializer
        else:
            return ClientCardSerializer


class HistoryCallViewSet(viewsets.ModelViewSet):
    queryset = HistoryCall.objects.all()
    serializer_class = HistoryCallSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = HistoryCallFilter


class NotesViewSet(viewsets.ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotesFilter
