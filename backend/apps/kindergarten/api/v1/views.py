from datetime import datetime

from django.core.exceptions import ValidationError
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from pytz import timezone
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.exceptions.api_exceptions import PhotoThemeDoesNotExist
from apps.kindergarten.api.v1.filters import KindergartenFilter
from apps.kindergarten.api.v1.serializers import (
    PhotoPriceSerializer,
    PhotoPriceByRegionSerializer,
    KindergartenSerializer
)
from apps.kindergarten.models import PhotoPrice, Ransom, Kindergarten
from apps.order.models import Order
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


class KindergartenListView(generics.ListAPIView):
    """Вью для получения списка детских садов."""

    queryset = Kindergarten.objects.all()
    serializer_class = KindergartenSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = KindergartenFilter
