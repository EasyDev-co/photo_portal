from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps_crm.notifications.api.v1.serializers import (
    NotificationSerializer,
    MarkNotificationAsReadSerializer
)


class NotificationListAPIView(APIView):
    def get(self, request):
        """Возвращает все уведомления пользователя."""
        notification_service = request.container.notification_service()
        user = request.user
        notifications = notification_service.list_user_notifications(user)

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllNotificationsAPIView(APIView):
    def get(self, request):
        """Получить все уведомления в системе."""
        notification_service = request.container.notification_service()
        notifications = notification_service.list_all_notifications()

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkNotificationAsReadAPIView(APIView):
    def post(self, request, notification_id):
        """Помечает уведомление прочитанным."""
        notification_service = request.container.notification_service()
        notification = notification_service.mark_notification_as_read(notification_id)

        serializer = MarkNotificationAsReadSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
