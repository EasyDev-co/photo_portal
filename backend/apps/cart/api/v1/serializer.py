from decimal import ROUND_HALF_UP, Decimal

import loguru
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.photo.models import Photo, PhotoLine
from apps.promocode.models import Promocode
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
    """Сериализатор для отображения пробника в корзине."""
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
    """Сериализатор для создания пробника в корзине."""
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    id = serializers.PrimaryKeyRelatedField(
        source='photo_line',
        queryset=PhotoLine.objects.all()
    )
    photos = PhotoInCartSerializer(many=True)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    promo_code = serializers.CharField(required=False)

    def create(self, validated_data):
        promo_code_data = validated_data.get('promo_code')
        promo_code = None
        if promo_code_data:
            promo_code = Promocode.objects.filter(
                code=promo_code_data, is_active=True
            ).first()

        photos_in_cart = validated_data.pop('photos')
        instance = CartPhotoLine.objects.create(**validated_data)
        user = self.context.get('request').user
        region_prices = PhotoPrice.objects.filter(region=validated_data['photo_line'].kindergarten.region)

        bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()

        total_price = Decimal(0)

        photo_list = []

        for photo in photos_in_cart:
            price_per_piece = region_prices.get(photo_type=photo['photo_type']).price

            discount_price = price_per_piece

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

        # стоимость фотокниги
        if validated_data['is_photobook']:
            photobook_price = region_prices.get(photo_type=PhotoType.photobook).price
            if promo_code and promo_code.discount_photobooks:
                photobook_price = promo_code.apply_discount(
                    price=photobook_price,
                    is_photobook=True
                )
            total_price += photobook_price


        # стоимость электронных фото
        ransom_amount = validated_data['photo_line'].kindergarten.region.ransom_amount
        if ransom_amount:
            if total_price >= ransom_amount:
                if not validated_data['is_digital']:
                    instance.is_digital = True
                    instance.save()
            else:
                if validated_data['is_digital']:
                    digital_price = region_prices.get(photo_type=PhotoType.digital).price
                    if promo_code and promo_code.discount_services:
                        digital_price = promo_code.apply_discount(
                            price=digital_price
                        )
                    total_price += digital_price

        # применение купона и промокода
        if bonus_coupon:
            total_price = bonus_coupon.use_bonus_coupon_to_price(total_price)

        instance.total_price = total_price
        instance.save()
        return instance


class CartSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
