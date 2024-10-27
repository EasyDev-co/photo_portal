from django.db.models import Sum, Count, Avg
from django.db.models.functions import Round
from django.utils import timezone as django_timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from apps.kindergarten.api.v1.permissions import IsManager
from apps.kindergarten.api.v1.serializers import (
    PhotoPriceSerializer,
    PhotoPriceByRegionSerializer,
    KindergartenStatsSerializer,
    RansomSerializer,
    KindergartenSerializer
)
from apps.kindergarten.models import PhotoPrice, Ransom, Kindergarten
from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import PhotoTheme


class PhotoPriceAPIView(APIView):
    """
    Представление для цен на фото.
    """

    def post(self, request):
        serializer = PhotoPriceByRegionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        photo_prices = PhotoPrice.objects.filter(region__name=serializer.data['region'])
        serializer = PhotoPriceSerializer(photo_prices, many=True)
        return Response(serializer.data)


class KindergartenStatsAPIView(APIView):
    """Вью для получения статистики по детскому саду."""

    permission_classes = (IsManager,)

    def get(self, request):
        kindergarten = request.user.managed_kindergarten

        if kindergarten is None:
            return Response(
                {"detail": "У вас нет прав доступа к этому ресурсу."},
                status=status.HTTP_403_FORBIDDEN
            )

        # достаем текущую фототему
        current_photo_theme = PhotoTheme.objects.filter(
            date_end__gte=django_timezone.now()
        )

        # достаем все заказы для текущей фототемы
        orders = Order.objects.filter(
            photo_line__kindergarten=kindergarten,
            photo_line__photo_theme__in=current_photo_theme
        )

        current_stats: dict = (
            # получаем общее количество заказов в данном д/с
                orders.aggregate(
                    total_orders=Count('id')
                )
                # объединяем словари
                |
                # получаем все завершенные/оплаченные заказы в данном д/с,
                # общую сумму этих заказов и среднюю сумму чека
                orders.filter(
                    status__in=(OrderStatus.completed, OrderStatus.paid_for)
                ).aggregate(
                    completed_orders=Count('id'),
                    total_amount=Round(Sum('order_price', default=0), 2),
                    average_order_value=Round(Avg('order_price', default=0), 2)
                )
        )

        # извлекаем суммы выкупа прошедших фототем для данного д/с
        ransom_objects = Ransom.objects.filter(
            kindergarten=kindergarten,
        )

        ransom_serializer = RansomSerializer(ransom_objects, many=True)
        current_serializer = KindergartenStatsSerializer(data=current_stats)
        current_serializer.is_valid(raise_exception=True)
        return Response({
            'current_stats': current_serializer.data,
            'past_stats': ransom_serializer.data,
        }, status=status.HTTP_200_OK)


class KindergartenSearchAPIView(ListAPIView):
    """Поиск детcкого сада по имени"""
    permission_classes = [IsManager]

    queryset = Kindergarten.objects.all()
    serializer_class = KindergartenSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name']
