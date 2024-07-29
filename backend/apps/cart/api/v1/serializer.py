import loguru
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.photo.models import Photo, PhotoLine


class PhotoInCartSerializer(serializers.ModelSerializer):

    class Meta:
        model = PhotoInCart
        fields = (
            'photo',
            'photo_type',
            'quantity',
            'price_per_piece',
            'discount_price',
        )



# class CartPhotoLineSerializer(serializers.ModelSerializer):
#     photos = serializers.SerializerMethodField()
#
#     class Meta:
#         model = CartPhotoLine
#         fields = '__all__'
#
#     def get_photos(self, obj):
#         photos_in_cart = PhotoInCart.objects.filter(cart_photo_line=obj)
#         serializer = PhotoInCartSerializer(photos_in_cart, many=True)
#         return serializer.data


class CartPhotoLineSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = serializers.SerializerMethodField()
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def get_photos(self, obj):
        photos_in_cart = PhotoInCart.objects.filter(cart_photo_line=obj)
        serializer = PhotoInCartSerializer(photos_in_cart, many=True)
        return serializer.data


class CartPhotoLineCreateUpdateSerializer(serializers.Serializer):
    cart = serializers.UUIDField()
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        photos_in_cart = validated_data.pop('photos')
        cart_id = validated_data.pop('cart')
        photo_line_id = validated_data.pop('id')
        cart = get_object_or_404(Cart, id=cart_id)
        photo_line = get_object_or_404(PhotoLine, id=photo_line_id)
        instance = CartPhotoLine.objects.create(
            cart=cart,
            photo_line=photo_line,
            **validated_data
        )
        photo_list = [
            PhotoInCart(
                photo_type=photo['photo_type'],
                quantity=photo['quantity'],
                discount_price=photo['discount_price'],
                photo=photo['photo'],
                price_per_piece=photo['price_per_piece'],
                cart_photo_line=instance,
            ) for photo in photos_in_cart]
        PhotoInCart.objects.bulk_create(photo_list)
        return instance





class CartSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
