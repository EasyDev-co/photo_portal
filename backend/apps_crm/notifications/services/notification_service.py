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
        return self.notification_repository.list()

    def list_user_notifications(self, user: User):
        """Получить все уведомления для пользователя."""
        return self.notification_repository.list(user=user)

    def mark_notification_as_read(self, notification_id: str):
        """Отметить уведомление как прочитанное."""
        notification = self.notification_repository.get_obj(id=notification_id)
        if notification:
            # Обновляем объект через update_obj
            return self.notification_repository.update_obj(notification, is_read=True)
        return None

