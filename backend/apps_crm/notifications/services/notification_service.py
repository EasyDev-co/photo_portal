from django.contrib.auth import get_user_model

from apps_crm.notifications.repositories.notification_repository import (
    NotificationRepository
)

User = get_user_model()


class NotificationService:
    def __init__(self, notification_repository: NotificationRepository):
        self.notification_repository = notification_repository

    def list_all_notifications(self):
        """Получить все уведомления в системе."""
        return self.notification_repository.get_all()

    def list_user_notifications(self, user: User):
        """Получить все уведомления для пользователя."""
        return self.notification_repository.get_all_for_user(user)

    def mark_notification_as_read(self, notification_id: str):
        """Отметить уведомление как прочитанное."""
        return self.notification_repository.mark_as_read(notification_id)

