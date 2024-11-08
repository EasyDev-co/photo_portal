from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from apps_crm.notifications.models import Notification
from apps_crm.notifications.api.v1.serializers import (
    NotificationSerializer,
    MarkNotificationAsReadSerializer,
    NotificationReadOnlySerializer
)


class NotificationListAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """Возвращает все уведомления пользователя."""
        service = request.container.notification_service()
        user = request.user
        notifications = service.list_user_notifications(user)

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllNotificationsAPIView(APIView):

    def get(self, request):
        """Получить все уведомления в системе."""
        service = request.container.notification_service()

        notifications = service.list_all_notifications()

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkNotificationAsReadAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, notification_id):
        """Помечает уведомление прочитанным."""
        notification_service = request.container.notification_service()
        notification = notification_service.mark_notification_as_read(notification_id)

        serializer = MarkNotificationAsReadSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UnreadNotificationsAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """
        Получить все непрочитанные уведомления для текущего пользователя.
        """
        user = request.user
        unread_notifications = Notification.objects.filter(user=user, is_read=False)
        serializer = NotificationReadOnlySerializer(unread_notifications, many=True)
        return Response(serializer.data)