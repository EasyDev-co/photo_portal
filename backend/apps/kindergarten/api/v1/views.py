from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.models import PhotoPrice
from apps.kindergarten.api.v1.serializers import PhotoPriceSerializer


class PhotoPriceAPIView(APIView):
    """
    Представление для цен на фото.
    Опционально принимает query-параметр 'region=[название_региона]'.
    """
    def get(self, request):
        if 'region' in request.query_params.keys():
            photo_prices = PhotoPrice.objects.filter(region__name=request.query_params['region'])
        else:
            photo_prices = PhotoPrice.objects.all()
        serializer = PhotoPriceSerializer(photo_prices, many=True)
        return Response(serializer.data)
