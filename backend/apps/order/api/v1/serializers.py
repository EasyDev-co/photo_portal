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
    is_photobook = serializers.BooleanField()


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для получения позиций (частей) заказа."""

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для получения заказов."""
    is_more_ransom_amount = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    order_items = OrderItemSerializer(many=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    @staticmethod
    def get_is_more_ransom_amount(obj):
        """Метод для проверки превышения суммы выкупа."""
        ransom_amount = obj.photo_line.kindergarten.region.ransom_amount
        if obj.order_price >= ransom_amount:
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


class OrderPaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrdersPayment
        fields = ['id', 'amount']
