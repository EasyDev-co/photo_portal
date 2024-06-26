from rest_framework.response import Response
from rest_framework.views import APIView

from apps.order.models import Order, OrderItem
from apps.order.api.v1.serializers import OrderSerializer


class OrderAPIView(APIView):
    """Представление для заказа."""

    @staticmethod
    def get(request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
