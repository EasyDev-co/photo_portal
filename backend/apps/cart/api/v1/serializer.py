from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart


class PhotoInCartSerializer(serializers.ModelSerializer):

    class Meta:
        model = PhotoInCart
        fields = '__all__'


class CartPhotoLineSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()

    class Meta:
        model = CartPhotoLine
        fields = '__all__'

    def get_photos(self, obj):
        photos_in_cart = PhotoInCart.objects.filter(cart_photo_line=obj)
        serializer = PhotoInCartSerializer(photos_in_cart, many=True)
        return serializer.data


class CartSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
