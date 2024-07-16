from rest_framework.response import Response
from rest_framework.views import APIView

from apps.kindergarten.models import PhotoPrice
from apps.kindergarten.api.v1.serializers import PhotoPriceSerializer, PhotoPriceByRegionSerializer


class PhotoPriceAPIView(APIView):
    """
    Представление для цен на фото.
    """
    def post(self, request):
        serializer = PhotoPriceByRegionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        photo_prices = PhotoPrice.objects.filter(region__name=serializer.data['region'])
        serializer = PhotoPriceSerializer(photo_prices, many=True)
        return Response(serializer.data)
