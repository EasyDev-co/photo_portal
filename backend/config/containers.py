from auditlog.models import LogEntry
from dependency_injector import containers, providers

from apps.kindergarten.models import Kindergarten
from apps_crm.client_cards.repositories.client_cards_repository import (
    ClientCardsRepository
)
from apps_crm.client_cards.services.client_cards_service import (
    ClientCardsService
)
from apps_crm.history.repositories.history_repository import HistoryRepository
from apps_crm.history.services.history_service import HistoryService
from apps_crm.notifications import models
from apps_crm.notifications.repositories.notification_repository import (
    NotificationRepository
)
from apps_crm.notifications.services.notification_service import (
    NotificationService
)


class Container(containers.DeclarativeContainer):
    notification_repository = providers.Factory(
        NotificationRepository, model=models.Notification
    )
    notification_service = providers.Factory(
        NotificationService,
        notification_repository=notification_repository
    )

    history_repository = providers.Factory(
        HistoryRepository, model=LogEntry
    )
    history_service = providers.Factory(
        HistoryService,
        history_repository=history_repository
    )

    client_cards_repository = providers.Factory(
        ClientCardsRepository, model=Kindergarten
    )
    client_card_service = providers.Factory(
        ClientCardsService,
        client_cards_repository=client_cards_repository
    )
