import logging
from datetime import datetime

from django.core.exceptions import ValidationError
from django.db.models import Sum, Count, Case, When, Avg
from django.shortcuts import get_object_or_404
from pytz import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.exceptions.api_exceptions import PhotoThemeDoesNotExist
from apps.kindergarten.api.v1.permissions import IsKindergartenManager
from apps.kindergarten.api.v1.serializers import (
    PhotoPriceSerializer,
    PhotoPriceByRegionSerializer
)
from apps.kindergarten.models import PhotoPrice, Ransom, Kindergarten
from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import PhotoTheme
from config.settings import TIME_ZONE


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


class PhotoThemeRansomAPIView(APIView):
    """
    Представление для подсчета статистики выкупа фототемы для данного детского сада.
    Фототема передается query параметром 'photo_theme_id'.
    """

    def get(self, request, pk):
        # Получаем объект PhotoTheme по id из query параметра.
        try:
            photo_theme = PhotoTheme.objects.get(
                id=request.query_params.get('photo_theme_id')
            )
        except (PhotoTheme.DoesNotExist, ValidationError):
            raise PhotoThemeDoesNotExist

        # Проверяем, существует ли уже запись Ransom для данного детского сада и фототемы.
        ransom = Ransom.objects.filter(
            kindergarten=pk,
            photo_theme=photo_theme
        ).first()
        if ransom:
            return Response(
                {'ransom': ransom.ransom_amount},
                status=status.HTTP_200_OK
            )

        # Ищем все оплаченные и/или завершенные заказы,
        # которые соответствуют данному детскому саду и фототеме.
        orders = Order.objects.filter(
            photo_line__kindergarten_id=pk,
            status__gt=1,
            photo_line__photo_theme=photo_theme
        ).select_related('photo_line')

        # Суммируем цену всех заказов
        ransom_amount = orders.aggregate(ransom_amount=Sum('order_price'))['ransom_amount'] or 0
        current_time = datetime.now().astimezone(tz=timezone(TIME_ZONE))

        # Если сумма выкупа больше 0 и фототема завершена,
        # записываем информацию о сумме выкупа в БД.
        if ransom_amount > 0 and current_time > photo_theme.date_end:
            Ransom.objects.create(
                kindergarten_id=pk,
                photo_theme=photo_theme,
                ransom_amount=ransom_amount
            )
        return Response(
            {'ransom': ransom_amount},
            status=status.HTTP_200_OK
        )


class KindergartenStatsAPIView(APIView):
    """Вью для получения статистики по детскому саду."""

    permission_classes = (IsKindergartenManager,)

    def get(self, request, pk):
        kindergarten: Kindergarten = get_object_or_404(Kindergarten, id=pk)

        stats = (
            Order.objects.filter(photo_line__kindergarten=kindergarten)
            .aggregate(
                total_orders=Count('id'),
                total_amount=Sum('order_price'),
                completed_orders=Count(Case(When(status=OrderStatus.completed, then=1))),
                average_order_value=Avg('order_price')
            )
        )

        response_data = {
            'total_orders': stats.get('total_orders', 0),
            'completed_orders': stats.get('completed_orders', 0),
            'average_order_value': stats.get('average_order_value') or 0,
            'total_sum': stats.get('total_amount') or 0
        }

        return Response(response_data)
