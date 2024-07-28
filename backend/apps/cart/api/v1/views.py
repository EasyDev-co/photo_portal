from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.api.v1.serializer import PhotoInCartSerializer, CartPhotoLineSerializer, CartSerializer
from apps.cart.models import Cart, CartPhotoLine, PhotoInCart

class PhotoInCartAPIView(APIView):
    def post(self, request):
        serializer = PhotoInCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CartPhotoLineAPIView(APIView):
    def get(self, request):
        cart_photo_lines = CartPhotoLine.objects.all()
        serializer = CartPhotoLineSerializer(cart_photo_lines, many=True)
        return Response(serializer.data)


class CartAPIView(APIView):
    """Представление для корзины."""
    def get(self, request):
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        response = []
        for photo_line in cart.photo_lines:
            response.append(
                {
                    "id": photo_line.id,
                    "photos": photo_line.photos,
                    "total_price": photo_line.total_price,
                    "is_digital": photo_line.is_digital,
                    "is_photobook": photo_line.is_photobook,
                }
            )
        return Response(response)
