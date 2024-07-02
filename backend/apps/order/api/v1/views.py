import loguru

import json
from django.core.serializers.json import DjangoJSONEncoder

from django.shortcuts import get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.order.models import Order, OrderItem
from apps.photo.models import Photo

from apps.order.api.v1.serializers import CartSerializer, OrderSerializer

from apps.utils.services import CartService


class OrderAPIView(APIView):
    """Представление для заказа."""

    @staticmethod
    def get(request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CartGetAddAPIView(APIView):
    """Представление для отображения корзины."""

    @swagger_auto_schema(responses={"200": openapi.Response(description="")},
                         request_body=CartSerializer)
    def post(self, request):
        """Добавление фото в корзину."""
        # serializer = CartSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        loguru.logger.info(request.data)
        cart = CartService(request)
        photo = get_object_or_404(Photo, id=request.data.get('id'))
        loguru.logger.info(photo.id)
        cart.add(
            photo=photo,
        )
        return Response({'message': f'Фото {photo.id} успешно добавлено в корзину'})

    def get(self, request):
        """Показать корзину."""
        cart = CartService(request)
        loguru.logger.info(cart.cart.keys())
        all_photos = Photo.objects.all()
        photos = Photo.objects.filter(id__in=cart.cart.keys())
        loguru.logger.info(all_photos)
        loguru.logger.info(photos)
        serializer = CartSerializer(photos, many=True)
        loguru.logger.info(serializer.data)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
