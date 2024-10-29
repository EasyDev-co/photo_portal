from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps_crm.history.api.v1.serializers import (
    HistorySerializer,
    ObjectHistorySerializer
)


class UserHistoryView(APIView):

    def get(self, request):
        """Возвращает историю пользователя."""
        service = request.container.history_service()
        user = request.user
        history = service.list_user_history(user)

        serializer = HistorySerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ObjectHistoryView(APIView):

    def post(self, request, *args, **kwargs):
        """Возвращает историю изменений объекта."""
        serializer = ObjectHistorySerializer(data=request.data)

        if serializer.is_valid():
            model_name = serializer.validated_data['model_name']
            object_id = serializer.validated_data['object_id']

            service = request.container.history_service()
            history = service.list_object_history(model_name, object_id)

            if not history:
                return Response(
                    {"detail": "История не найдена"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serialized_history = HistorySerializer(history, many=True)
            return Response(
                {'history': serialized_history.data}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)