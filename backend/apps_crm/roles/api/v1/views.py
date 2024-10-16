from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


from apps_crm.roles.models import (
    ClientCard, Department, Region, Role, Permission
)
from apps_crm.roles.api.v1.serializers import (
    ClientCardSerializer,
    DepartmentSerializer,
    RegionSerializer,
    RoleSerializer,
    PermissionSerializer
)
from apps_crm.roles.services import ClientCardService



class RegionViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления регионами (CRUD операции)."""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAdminUser]


class DepartmentViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления отделами (CRUD операции)."""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]


class PermissionViewSet(viewsets.ModelViewSet):
    """Вьюсет для управления правами (CRUD операции)."""
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminUser]


class RoleViewSet(viewsets.ModelViewSet):
    """
    Вьюсет для управления ролями (CRUD операции).
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]


class ClientCardViewSet(viewsets.ModelViewSet):
    """
    Вьюсет для управления карточками клиентов.
    """
    queryset = ClientCard.objects.all()
    serializer_class = ClientCardSerializer
    # permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'], url_path='assign-manager')
    def assign_manager(self, request):
        """
        Эндпоинт для массового назначения ответственного менеджера.
        """
        client_card_ids = request.data.get('client_card_ids', [])
        manager_id = request.data.get('manager_id')

        if not client_card_ids or not manager_id:
            return Response(
                {"detail": "Необходимо указать список ID карточек клиентов и ID менеджера."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client_cards = ClientCardService.assign_responsible_manager(client_card_ids, manager_id)
            serializer = self.get_serializer(client_cards, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='remove-manager')
    def remove_manager(self, request):
        """
        Эндпоинт для массового удаления ответственного менеджера.
        """
        client_card_ids = request.data.get('client_card_ids', [])

        if not client_card_ids:
            return Response(
                {"detail": "Необходимо указать список ID карточек клиентов."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client_cards = ClientCardService.remove_responsible_manager(client_card_ids)
            serializer = self.get_serializer(client_cards, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)