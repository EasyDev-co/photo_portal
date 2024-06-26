from rest_framework import serializers

from apps.order.models import Order, OrderItem
from apps.user.models.user import UserRole


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для получения заказов."""
    is_more_ransom_amount = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

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
        role = obj.user.role
        return UserRole(role).label


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для получения позиций (частей) заказа."""

    class Meta:
        model = OrderItem
        fields = '__all__'
