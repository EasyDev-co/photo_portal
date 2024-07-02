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
        cart = CartService(request)
        photo = get_object_or_404(Photo, id=request.data.get('id'))
        if photo:
            cart.add(
                photo=photo,
            )
            return Response({'message': f'Фото {photo.id} успешно добавлено в корзину'})
        return Response({'message': f'Фото не найдено в БД'})

    def get(self, request):
        """Показать корзину."""
        cart = CartService(request)
        photos = Photo.objects.filter(id__in=cart.cart.keys())
        serializer = CartSerializer(photos, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        cart = CartService(request)
        photo = get_object_or_404(Photo, id=pk)
        cart.remove(photo=photo)
        return Response({'message': f'Фото {photo.id} удалено из корзины'})
