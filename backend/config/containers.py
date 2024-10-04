from dependency_injector import containers, providers

from apps_crm.notifications import models
from apps_crm.notifications.repositories.notification_repository import (
    NotificationRepository
)
from apps_crm.notifications.services.notification_service import (
    NotificationService
)


class Container(containers.DeclarativeContainer):
    notification_repository = providers.Factory(NotificationRepository, model=models.Notification)
    notification_service = providers.Factory(
        NotificationService,
        notification_repository=notification_repository
    )
