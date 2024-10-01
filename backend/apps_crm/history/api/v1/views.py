from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps_crm.history.api.v1.serializers import HistorySerializer


class UserHistoryView(APIView):

    def get(self, request):
        """Возвращает историю пользователя."""
        service = request.container.history_service()
        user = request.user
        history = service.list_user_history(user)

        serializer = HistorySerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
