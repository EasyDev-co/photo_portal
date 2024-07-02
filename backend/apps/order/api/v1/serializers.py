from rest_framework import serializers

from apps.order.models import Order, OrderItem
from apps.order.models.const import OrderStatus
from apps.photo.models import Photo
from apps.user.models.user import UserRole


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор корзины."""

    class Meta:
        model = Photo
        fields = ('id',)


class CartAddSerializer(CartSerializer):
    """Сериализатор добавления фото в корзину."""

    amount = serializers.IntegerField()
    photo_type = serializers.IntegerField()


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для получения позиций (частей) заказа."""

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderListSerializer(serializers.ModelSerializer):
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
        """Метод для получения роли заказчика."""
        role = obj.user.role
        return UserRole(role).label

    @staticmethod
    def get_status(obj):
        status = obj.status
        return OrderStatus(status).label


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

# Order
# order_price
# user - fk
# kindergarten
# status

# OrderItem
# photo_type
# is_digital
# amount
# order - fk
# photo - fk
