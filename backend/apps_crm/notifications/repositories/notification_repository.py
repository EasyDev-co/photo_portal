from apps_crm.notifications.models import Notification
from apps_crm.utils.repsitory.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    """Репозиторий для работы с Order"""
