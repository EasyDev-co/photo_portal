from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

from apps_crm.client_cards.models import ClientCardTask, HistoryCall, Notes, ClientCard
from apps_crm.client_cards.api.v1.serializers import ClientCardTaskSerializer, HistoryCallSerializer, NotesSerializer, \
    ClientCardSerializer, ClientCardRetrieveSerializer, ClientCardUpdateSerializer
from apps_crm.roles.models import Employee, UserRole
from apps_crm.roles.permissions import IsROPorDirector, IsAuthorOrROPorDirector, IsEmployee
from apps_crm.client_cards.filters import ClientCardTaskFilter, HistoryCallFilter, NotesFilter, ClientCardFilter


class ClientCardPermissionMixin:
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsEmployee]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAuthorOrROPorDirector]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class RoleBasedQuerySetMixin:
    def get_queryset(self):
        employee = getattr(self.request.user, 'employee', None)

        if not employee:
            return self.model.objects.none()

        if employee.employee_role in [UserRole.ROP, UserRole.CEO]:
            return self.model.objects.all()

        if hasattr(self.model, 'author'):
            return self.model.objects.filter(author=employee)

        if hasattr(self.model, 'responsible_manager'):
            return self.model.objects.filter(responsible_manager=employee)

        return self.model.objects.none()


class AuthorCreateMixin:
    """ Миксин для присваивания сотрудника автором """
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        employee = get_object_or_404(Employee, user=self.request.user)
        serializer.save(author=employee)


class ClientCardViewSet(RoleBasedQuerySetMixin, viewsets.ModelViewSet):
    """ Вью для карточек клиента. """
    model = ClientCard
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


class ClientCardTaskViewSet(
    RoleBasedQuerySetMixin,
    ClientCardPermissionMixin,
    AuthorCreateMixin,
    viewsets.ModelViewSet
):
    model = ClientCardTask
    queryset = ClientCardTask.objects.all()
    serializer_class = ClientCardTaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClientCardTaskFilter


class HistoryCallViewSet(
    RoleBasedQuerySetMixin,
    AuthorCreateMixin,
    viewsets.ModelViewSet
):
    model = HistoryCall
    queryset = HistoryCall.objects.all()
    serializer_class = HistoryCallSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = HistoryCallFilter


class NotesViewSet(
    RoleBasedQuerySetMixin,
    AuthorCreateMixin,
    viewsets.ModelViewSet
):
    model = Notes
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotesFilter
