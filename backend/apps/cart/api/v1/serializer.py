from decimal import Decimal

import loguru
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.photo.models import Photo, PhotoLine


class PhotoInCartSerializer(serializers.ModelSerializer):
    """Сериализатор для Фото в корзине."""
    id = serializers.PrimaryKeyRelatedField(source='photo', queryset=Photo.objects.all())
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = PhotoInCart
        fields = (
            'id',
            'photo_type',
            'quantity',
            'price_per_piece',
            'discount_price',
        )


class CartPhotoLineSerializer(serializers.Serializer):
    """Сериализатор для отображения Фотолиний в корзине."""
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
    """Сериализатор для создания Фотолиний в корзине."""
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    id = serializers.PrimaryKeyRelatedField(
        source='photo_line',
        queryset=PhotoLine.objects.all()
    )
    photos = PhotoInCartSerializer(many=True)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        photos_in_cart = validated_data.pop('photos')
        # cart_id = validated_data.pop('cart')
        # photo_line_id = validated_data.pop('photo_line')
        # cart = get_object_or_404(Cart, id=cart_id)
        # photo_line = get_object_or_404(PhotoLine, id=photo_line_id)
        loguru.logger.info(validated_data)

        instance = CartPhotoLine.objects.create(**validated_data)
        photo_list = [
            PhotoInCart(
                photo_type=photo['photo_type'],
                quantity=photo['quantity'],
                discount_price=photo['discount_price'],
                photo=photo['photo'],
                price_per_piece=get_object_or_404(PhotoPrice, photo_type=photo['photo_type'], region=validated_data['photo_line'].kindergarten.region).price,
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
