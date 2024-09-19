from django.contrib.auth import get_user_model

from apps_crm.notifications.models import Notification

User = get_user_model()


class NotificationRepository:
    def get_all(self):
        """Получить все уведомления."""
        return Notification.objects.all()

    def get_all_for_user(self, user: User):
        """Получить все уведомления для конкретного пользователя."""
        return Notification.objects.filter(user=user).order_by('-created')

    def mark_as_read(self, notification_id: str):
        """Отметить уведомление как прочитанное."""
        notification = Notification.objects.get(id=notification_id)
        notification.is_read = True
        notification.save()
        return notification
