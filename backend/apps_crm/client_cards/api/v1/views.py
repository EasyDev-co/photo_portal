import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.api.v1.serializers import KindergartenSerializer
from apps_crm.client_cards.api.v1.serializers import \
    (
    KindergartenCreateSerializer, KindergartenUpdateSerializer
)


class ClientCardDetailView(APIView):

    def get(self, request, id):
        """Возвращает историю пользователя."""
        service = request.container.client_card_service()
        client_card = service.get_client_card(client_card_id=id)

        serializer = KindergartenSerializer(client_card)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, id):
        """Частичное обновление карточки клиента."""
        service = request.container.client_card_service()
        client_card = service.get_client_card(client_card_id=id)

        serializer = KindergartenUpdateSerializer(
            client_card, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Удаляет карточку клиента."""
        service = request.container.client_card_service()
        client_card = service.get_client_card(client_card_id=id)

        if not client_card:
            return Response(
                {"detail": "Карточка клиента не найдена."},
                status=status.HTTP_404_NOT_FOUND
            )

        service.client_cards_repository.delete_obj(id=client_card.id)
        return Response(
            {"detail": "Карточка клиента успешно удалена."},
            status=status.HTTP_204_NO_CONTENT
        )


class ClientCardListView(APIView):

    def get(self, request):
        service = request.container.client_card_service()
        client_cards = service.get_client_cards()

        if not client_cards:
            return Response(
                {"message": "Нет доступных клиентских карточек"},
                status=status.HTTP_200_OK
            )

        response = []
        for kindergarten in client_cards:
            statistics = service.get_statistics(kindergarten)
            kindergarten_data = KindergartenSerializer(kindergarten).data
            kindergarten_data['statistics'] = statistics
            response.append(kindergarten_data)

        return Response(response, status=status.HTTP_200_OK)

    def post(self, request):
        """Создает новую карточку."""
        serializer = KindergartenCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
