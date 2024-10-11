from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.api.v1.serializers import KindergartenSerializer


class ClientCardDetailView(APIView):

    def get(self, request, id):
        """Возвращает историю пользователя."""
        service = request.container.client_card_service()
        client_card = service.get_client_card(client_card_id=id)

        serializer = KindergartenSerializer(client_card)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
