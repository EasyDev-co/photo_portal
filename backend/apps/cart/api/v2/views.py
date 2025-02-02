from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart, CartPhotoLine
from apps.cart.services.cart import CartService
from apps.cart.api.v2.serializers import CartPhotoLineCreateUpdateV2Serializer, CartPhotoLineV2Serializer

from loguru import logger


class CartV2APIView(APIView):
    """
    Представление для работы с корзиной:
      - GET: возвращает позиции корзины текущего пользователя;
      - POST: обновляет корзину на основе переданных данных.
    """
    def get(self, request, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_photo_lines = CartPhotoLine.objects.filter(cart=cart)
        serializer = CartPhotoLineV2Serializer(cart_photo_lines, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        logger.info(f"Входные данные: {request.data}")
        # Получаем или создаём корзину пользователя
        cart = CartService.get_or_create_cart(request.user)
        logger.info(f"Используемая корзина: {cart}")

        # Удаляем предыдущие позиции корзины
        CartService.clear_cart_photo_lines(cart)

        # Добавляем порядковый номер (child_number) и подставляем id корзины для каждого элемента
        for index, data in enumerate(request.data, start=1):
            data['child_number'] = index
            data['cart'] = cart.id

        serializer = CartPhotoLineCreateUpdateV2Serializer(
            data=request.data,
            context={'request': request},
            many=True
        )
        serializer.is_valid(raise_exception=True)
        created_instances = serializer.save()

        output_serializer = CartPhotoLineV2Serializer(created_instances, many=True)
        return Response(output_serializer.data)