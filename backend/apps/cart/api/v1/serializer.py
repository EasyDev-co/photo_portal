from decimal import ROUND_HALF_UP, Decimal

from django.shortcuts import get_object_or_404

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.kindergarten.models import PhotoPrice
from apps.photo.models import Photo, PhotoLine
from apps.promocode.models.bonus_coupon import BonusCoupon


class PhotoInCartSerializer(serializers.ModelSerializer):
    """Сериализатор для Фото в корзине."""
    id = serializers.PrimaryKeyRelatedField(source='photo', queryset=Photo.objects.all())
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

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

    @staticmethod
    def get_photos(obj):
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
    # total_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        photos_in_cart = validated_data.pop('photos')
        instance = CartPhotoLine.objects.create(**validated_data)
        user = self.context.get('request').user

        promocode = user.promocode
        # bonus_coupon = bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()

        total_price = Decimal(0)

        photo_list = []

        for photo in photos_in_cart:
            price_per_piece = get_object_or_404(
                PhotoPrice,
                photo_type=photo['photo_type'],
                region=validated_data['photo_line'].kindergarten.region
            ).price

            discount_price = price_per_piece

            if promocode:
                discount_price = promocode.use_promocode_to_price(
                    Decimal(price_per_piece.quantize(Decimal("0.0"), rounding=ROUND_HALF_UP)), photo['photo_type']
                )

            photo_list.append(
                PhotoInCart(
                    photo_type=photo['photo_type'],
                    quantity=photo['quantity'],
                    discount_price=discount_price,
                    photo=photo['photo'],
                    price_per_piece=price_per_piece,
                    cart_photo_line=instance,
                )
            )
            total_price += discount_price * photo['quantity']
        PhotoInCart.objects.bulk_create(photo_list)
        instance.total_price = total_price
        instance.save()
        return instance


class CartSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
