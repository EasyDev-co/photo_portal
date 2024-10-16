import logging

from django.contrib.auth import get_user_model
from django.db.models import Avg, Sum, Count
from django.db.models.functions import Round
from django.utils import timezone as django_timezone

from apps.kindergarten.api.v1.serializers import (
    KindergartenStatsSerializer
)
from apps.kindergarten.models import Kindergarten
from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import PhotoTheme
from apps_crm.client_cards.repositories.client_cards_repository import (
    ClientCardsRepository
)

User = get_user_model()


class ClientCardsService:
    def __init__(self, client_cards_repository: ClientCardsRepository):
        self.client_cards_repository = client_cards_repository

    def get_client_card(self, client_card_id: str):
        return self.client_cards_repository.get_obj(id=client_card_id)

    def get_client_cards(self):
        return self.client_cards_repository.list()

    def get_statistics(self, kindergarten: Kindergarten):
        current_photo_theme = PhotoTheme.objects.filter(
            date_end__gte=django_timezone.now()
        )

        orders = Order.objects.filter(
            photo_line__kindergarten=kindergarten,
            photo_line__photo_theme__in=current_photo_theme
        )

        current_stats: dict = (
                orders.aggregate(
                    total_orders=Count('id')
                )
                |
                orders.filter(
                    status__in=(OrderStatus.completed, OrderStatus.paid_for)
                ).aggregate(
                    completed_orders=Count('id'),
                    total_amount=Round(Sum('order_price', default=0), 2),
                    average_order_value=Round(Avg('order_price', default=0), 2)
                )
        )

        current_serializer = KindergartenStatsSerializer(data=current_stats)
        current_serializer.is_valid(raise_exception=True)

        return current_serializer.data

    def create_client_card(self,  **kwargs):
        return self.client_cards_repository.create_obj(**kwargs)
