from decimal import Decimal

from django.db import transaction, DatabaseError

from rest_framework import serializers

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.photo.models import Photo, PhotoLine
from apps.promocode.models import Promocode
from apps.promocode.models.bonus_coupon import BonusCoupon
from apps.user.models import UserRole

from loguru import logger


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
    photo_line_id = serializers.UUIDField(required=False, allow_null=True)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    is_free_digital = serializers.BooleanField(default=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    original_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    child_number = serializers.IntegerField(required=False, allow_null=True)

    @staticmethod
    def get_photos(obj):
        photos_in_cart = PhotoInCart.objects.filter(cart_photo_line=obj)
        serializer = PhotoInCartSerializer(photos_in_cart, many=True)
        return serializer.data

    def to_representation(self, instance):
        """
        Добавляем поле photo_line_id, чтобы извлечь id photo_line из модели CartPhotoLine.
        """
        representation = super().to_representation(instance)

        # Получаем photo_line_id из instance напрямую
        photo_line_id = str(instance.photo_line_id) if instance.photo_line_id else None

        representation['photo_line_id'] = photo_line_id

        return representation


class CartPhotoLineCreateUpdateSerializer(serializers.Serializer):
    """Сериализатор для создания пробника в корзине."""
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    id = serializers.PrimaryKeyRelatedField(
        source='photo_line',
        queryset=PhotoLine.objects.all()
    )
    photos = PhotoInCartSerializer(many=True)
    is_digital = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    is_free_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    promo_code = serializers.CharField(required=False)
    child_number = serializers.IntegerField(required=False)

    def create(self, validated_data):
        photos_in_cart = validated_data.pop('photos')

        quantity = 0
        for photo_in_cart in photos_in_cart:
            quantity += photo_in_cart.get('quantity')

        if quantity == 0 and not validated_data["is_digital"] and not validated_data["is_photobook"]:
            return None

        promo_code_data = validated_data.pop('promo_code', None)
        instance = CartPhotoLine.objects.create(**validated_data)
        user = self.context.get('request').user
        region_prices = PhotoPrice.objects.filter(
            region=validated_data['photo_line'].kindergarten.region
        )
        ransom_amount_for_digital_photos = (
            validated_data['photo_line']
            .kindergarten
            .region
            .ransom_amount_for_digital_photos
        )
        ransom_amount_for_calendar = (
            validated_data['photo_line']
            .kindergarten
            .region
            .ransom_amount_for_calendar
        )

        bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()

        total_price = Decimal(0)
        original_price = Decimal(0)

        photo_list = []

        promo_code = None
        if promo_code_data:
            try:
                manager = user if user.role == UserRole.manager else user.kindergarten.first().manager
                promo_code = Promocode.objects.get(
                    code=promo_code_data,
                    is_active=True,
                    user=manager
                )
            except Promocode.DoesNotExist:
                raise serializers.ValidationError('Неверный промокод.')

        # стоимость остальных фоток без фотокниги и э/ф
        for photo in photos_in_cart:
            if photo.get('quantity') == 0:
                continue
            price_per_piece = region_prices.get(photo_type=photo['photo_type']).price

            discount_price = price_per_piece

            if promo_code and promo_code.discount_services:
                discount_price = promo_code.apply_discount(
                    price=price_per_piece
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
            original_price += discount_price * photo['quantity']
        PhotoInCart.objects.bulk_create(photo_list)

        # стоимость фотокниги
        if validated_data['is_photobook']:
            if not user.kindergarten.first().has_photobook:
                raise serializers.ValidationError("Детский сад не имеет фотокниг")

            photobook_price = region_prices.get(photo_type=PhotoType.photobook).price
            if promo_code and promo_code.discount_photobooks:
                photobook_price = promo_code.apply_discount(
                    price=photobook_price,
                    is_photobook=True
                )
            total_price += photobook_price
            original_price += photobook_price

        # # стоимость электронных фото
        if ransom_amount_for_digital_photos:

            # if not validated_data['is_digital'] and total_price >= ransom_amount_for_digital_photos:
            #     if self.child_number == 1:
            #         instance.is_digital = True
            #         instance.is_free_digital = True
            #         instance.save()

            if validated_data['is_digital'] and total_price < ransom_amount_for_digital_photos:
                digital_price = region_prices.get(photo_type=PhotoType.digital).price

                if promo_code and promo_code.discount_services:
                    digital_price = promo_code.apply_discount(
                        price=digital_price
                    )

                total_price += digital_price
                original_price += digital_price

        # выкуп для бесплатного календаря
        # if ransom_amount_for_calendar and total_price >= ransom_amount_for_calendar:
        #     instance.is_free_calendar = True
        #     instance.save()

        # применение купона и промокода
        if bonus_coupon:
            initial_total_price = total_price
            total_price = bonus_coupon.use_bonus_coupon_to_price(total_price)  # цена после применения купона
            if total_price == Decimal(1):
                instance.cart.order_fully_paid_by_coupon = True
            else:
                instance.cart.bonus_coupon = initial_total_price - total_price

        if user.role == UserRole.manager:
            manager_discount = user.manager_discount_balance
            if total_price > 0 and manager_discount > 0:
                if total_price <= manager_discount:
                    total_price = Decimal(1)
                    instance.cart.order_fully_paid_by_coupon = True
                else:
                    total_price -= manager_discount
                    instance.cart.order_fully_paid_by_coupon = False
        try:
            instance.original_price = original_price
            instance.total_price = total_price
            instance.cart.promocode = promo_code
            instance.cart.bonus_coupon = user.manager_discount_balance
            with transaction.atomic():
                instance.cart.save()
                instance.save()
        except Exception:
            raise serializers.ValidationError('Не удалось сохранить данные.')
        return instance


class CartSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = PhotoInCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    photo_line_id = serializers.UUIDField(required=False, allow_null=True)

    def to_representation(self, instance):
        """
        Добавляем поле photo_line_id, чтобы извлечь id photo_line из первой фотографии.
        """
        representation = super().to_representation(instance)

        photo_ids = [photo['id'] for photo in representation.get('photos', [])]
        photo_instances = Photo.objects.filter(id__in=photo_ids)

        photo_line_id = None
        if photo_instances.exists():
            photo_line_id = str(photo_instances.first().photo_line_id)

        representation['photo_line_id'] = photo_line_id

        return representation
