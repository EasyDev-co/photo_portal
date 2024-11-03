from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

from apps_crm.client_cards.models import ClientCardTask, HistoryCall, Notes, ClientCard
from apps_crm.client_cards.api.v1.serializers import ClientCardTaskSerializer, HistoryCallSerializer, NotesSerializer, \
    ClientCardSerializer, ClientCardRetrieveSerializer, ClientCardUpdateSerializer
from apps_crm.roles.models import Employee
from apps_crm.roles.permissions import IsROPorDirector, IsAuthorOrROPorDirector
from apps_crm.client_cards.filters import ClientCardTaskFilter, HistoryCallFilter, NotesFilter, ClientCardFilter


class AuthorCreateMixin:
    """Миксин для присваивания сотрудника автором """
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        employee = get_object_or_404(Employee, user=self.request.user)
        serializer.save(author=employee)


class ClientCardViewSet(viewsets.ModelViewSet):
    """ Вью для карточек клиента. """
    queryset = ClientCard.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardFilter

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClientCardRetrieveSerializer
        elif self.action in ['update', 'partial_update']:
            return ClientCardUpdateSerializer
        else:
            return ClientCardSerializer


class ClientCardTaskViewSet(AuthorCreateMixin, viewsets.ModelViewSet):
    queryset = ClientCardTask.objects.all()
    serializer_class = ClientCardTaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardTaskFilter


class HistoryCallViewSet(AuthorCreateMixin, viewsets.ModelViewSet):
    queryset = HistoryCall.objects.all()
    serializer_class = HistoryCallSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = HistoryCallFilter


class NotesViewSet(AuthorCreateMixin, viewsets.ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotesFilter
