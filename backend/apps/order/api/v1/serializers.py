from rest_framework import serializers

from apps.order.models import Order, OrderItem
from apps.order.models.const import OrderStatus
from apps.user.models.user import UserRole


class PhotoCartSerializer(serializers.Serializer):
    photo_id = serializers.CharField()
    photo_type = serializers.IntegerField()
    quantity = serializers.IntegerField()
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    kindergarten_id = serializers.CharField(required=False)


class PhotoCartRemoveSerializer(serializers.Serializer):
    photo_id = serializers.CharField()
    photo_type = serializers.IntegerField()

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
        ransom_amount = obj.kindergarten.region.ransom_amount
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