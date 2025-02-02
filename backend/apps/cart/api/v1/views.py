import loguru
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.api.v1.serializer import (
    PhotoInCartSerializer,
    CartPhotoLineSerializer,
    CartPhotoLineCreateUpdateSerializer
)
from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.utils.models_mixins.models_mixins import logger


class PhotoInCartAPIView(APIView):
    def post(self, request):
        serializer = PhotoInCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get(self, request):
        photos_in_cart = PhotoInCart.objects.all()
        serializer = PhotoInCartSerializer(photos_in_cart, many=True)
        return Response(serializer.data)


class CartPhotoLineAPIView(APIView):
    def get(self, request):
        cart_photo_lines = CartPhotoLine.objects.all()
        serializer = CartPhotoLineSerializer(cart_photo_lines, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CartPhotoLineCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(CartPhotoLineSerializer(instance).data)


class CartAPIView(APIView):
    """Представление для корзины."""

    def get(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart_photo_lines = CartPhotoLine.objects.filter(cart=cart)
        serializer = CartPhotoLineSerializer(cart_photo_lines, many=True)
        return Response(serializer.data)

    def post(self, request):
        carts = Cart.objects.filter(user=request.user)
        if carts.count() > 1:
            carts.exclude(id=carts.first().id).delete()

        cart = carts.first()
        logger.info("cart: {cart}")
        if not cart:
            cart = Cart.objects.create(user=request.user)

        cart_photo_lines = cart.cart_photo_lines.select_related('cart')
        cart_photo_lines.delete()

        validated_data = request.data

        child_num = 1

        for data in validated_data:
            data['cart'] = cart.id

            data['child_number'] = child_num
            child_num += 1

            logger.info(f"data: {data}")


        serializer = CartPhotoLineCreateUpdateSerializer(
            data=validated_data, context={'request': request}, many=True
        )
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()

        for data in instance:
            logger.info(f"data_instance: {data}")

        return Response(CartPhotoLineSerializer(instance, many=True).data)
