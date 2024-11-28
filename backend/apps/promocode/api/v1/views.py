from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.kindergarten.api.v1.permissions import IsManager
from apps.promocode.models.promocode import Promocode
from .serializers import PromocodeSerializer


class PromocodeRetrieveAPIView(APIView):
    """
    Эндпоинт для получения активного промокода по ID заведующей и ID фототемы.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        photo_theme_id = request.query_params.get('photo_theme_id')

        if not user_id or not photo_theme_id:
            return Response(
                {'message': 'Необходимо указать параметры user_id и photo_theme_id.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка наличия промокода
        promocode = Promocode.objects.filter(
            user_id=user_id,
            photo_theme_id=photo_theme_id,
            is_active=True,
            activate_count__gt=0
        ).first()

        if not promocode:
            return Response(
                {'message': 'Активный промокод не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PromocodeSerializer(promocode)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PromocodeAPIView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        promocode = Promocode.objects.get(
            user=request.user,
            is_active=True
        )

        if not promocode:
            return Response(
                {'message': 'Активный промокод не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            PromocodeSerializer(promocode).data,
            status=status.HTTP_200_OK
        )


