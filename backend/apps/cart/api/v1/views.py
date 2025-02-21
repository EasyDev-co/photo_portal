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
        logger.info(f"data: {request.data}")

        carts = Cart.objects.filter(user=request.user)
        if carts.count() > 1:
            carts.exclude(id=carts.first().id).delete()

        cart = carts.first()
        logger.info(f"cart: {cart}")
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

        ransom_amount_for_digital_photos = None
        ransom_amount_for_calendar = None

        ransom_amount_for_digital_photos_second = None
        ransom_amount_for_calendar_second = None

        ransom_amount_for_digital_photos_third = None
        ransom_amount_for_calendar_third = None

        if len(instance) > 0:
            cart_photo_line = cart.cart_photo_lines.all().first()
            if cart_photo_line:
                ransom_amount_for_digital_photos = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_digital_photos
                )
                ransom_amount_for_calendar = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_calendar
                )

                ransom_amount_for_digital_photos_second = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_digital_photos_second
                )
                ransom_amount_for_calendar_second = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_calendar_second
                )

                ransom_amount_for_digital_photos_third = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_digital_photos_third
                )
                ransom_amount_for_calendar_third = (
                    cart_photo_line
                    .photo_line
                    .kindergarten
                    .region
                    .ransom_amount_for_calendar_third
                )

        all_price = 0
        for data in instance:
            all_price += data.total_price

            if ransom_amount_for_digital_photos:
                if data.child_number == 1 and all_price >= ransom_amount_for_digital_photos:
                    data.is_free_digital = True
            if ransom_amount_for_digital_photos_second:
                if data.child_number == 2 and all_price >= ransom_amount_for_digital_photos_second:
                    data.is_free_digital = True
            if ransom_amount_for_digital_photos_third:
                if data.child_number == 3 and all_price >= ransom_amount_for_digital_photos_third:
                    data.is_free_digital = True

            if ransom_amount_for_calendar:
                if data.child_number == 1 and all_price >= ransom_amount_for_calendar:
                    data.is_free_calendar = True
            if ransom_amount_for_calendar_second:
                if data.child_number == 2 and all_price >= ransom_amount_for_calendar_second:
                    data.is_free_calendar = True
            if ransom_amount_for_calendar_third:
                if data.child_number == 3 and all_price >= ransom_amount_for_calendar_third:
                    data.is_free_calendar = True

            if data.cart_id and Cart.objects.filter(id=data.cart_id).exists():
                data.save()

        return Response(CartPhotoLineSerializer(instance, many=True).data)
