from decimal import Decimal

import loguru
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.order.models import Order, OrderItem, OrdersPayment
from apps.order.models.const import OrderStatus
from apps.photo.models import Photo, PhotoLine
from apps.user.models.user import UserRole

User = get_user_model()


class PhotoCartSerializer(serializers.Serializer):
    id = serializers.CharField()
    photo_type = serializers.IntegerField()
    quantity = serializers.IntegerField()
    price_per_piece = serializers.SerializerMethodField()
    discount_price = serializers.CharField(required=False)

    @staticmethod
    def get_price_per_piece(obj):
        photo = get_object_or_404(Photo, id=obj['id'])
        region = photo.photo_line.kindergarten.region
        photo_price = get_object_or_404(PhotoPrice, region=region, photo_type=obj['photo_type'])
        return str(photo_price.price)


class PhotoLineCartSerializer(serializers.Serializer):
    id = serializers.CharField()
    photos = PhotoCartSerializer(many=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    is_digital = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField()


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для получения позиций (частей) заказа."""

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для получения заказов."""
    is_more_ransom_amount_for_digital_photos = serializers.SerializerMethodField()
    is_more_ransom_amount_for_calendar = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    order_items = OrderItemSerializer(many=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    @staticmethod
    def get_is_more_ransom_amount_for_digital_photos(obj):
        """Метод для проверки превышения суммы выкупа."""
        ransom_amount_for_digital_photos = obj.photo_line.kindergarten.region.ransom_amount_for_digital_photos
        if obj.order_price >= ransom_amount_for_digital_photos:
            return True
        return False

    @staticmethod
    def get_is_more_ransom_amount_for_calendar(obj):
        """Метод для проверки превышения суммы выкупа."""
        ransom_amount_for_calendar = obj.photo_line.kindergarten.region.ransom_amount_for_calendar
        if obj.order_price >= ransom_amount_for_calendar:
            return True
        return False

    @staticmethod
    def get_user_role(obj):
        """Метод для получения названия роли заказчика."""
        role = obj.user.role
        return UserRole(role).label

    @staticmethod
    def get_status(obj):
        """Метод для получения названия статуса заказа."""
        status = obj.status
        return OrderStatus(status).label


class OrderItemDetailSerializer(serializers.ModelSerializer):
    photo_number = serializers.SerializerMethodField()
    photo_type = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['photo_number', 'photo_type', 'amount', 'price']

    def get_photo_number(self, obj):
        return obj.photo.number if obj.photo else None

    def get_photo_type(self, obj):
        return PhotoType(obj.photo_type).label


class OrderDetailSerializer(serializers.ModelSerializer):
    photo_theme = serializers.SerializerMethodField()
    order_items = OrderItemDetailSerializer(many=True)

    class Meta:
        model = Order
        fields = ['photo_theme', 'created', 'order_items']

    def get_photo_theme(self, obj):
        return obj.photo_line.photo_theme.name


class OrdersPaymentSerializer(serializers.ModelSerializer):
    orders = OrderDetailSerializer(many=True)

    class Meta:
        model = OrdersPayment
        fields = ['id', 'amount', 'orders']


class OrdersPaymentBriefSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrdersPayment
        fields = ['id', 'amount', 'created']


class OrderManagerSerializer(serializers.ModelSerializer):
    """Сериализатор для вывода информации о заказе"""

    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Order
        fields = ['order_price', 'user_first_name', 'user_last_name', 'payment_id']
