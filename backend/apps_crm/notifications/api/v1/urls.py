from django.urls import path

from apps_crm.notifications.api.v1.views import (
    NotificationListAPIView,
    MarkNotificationAsReadAPIView,
    AllNotificationsAPIView
)

urlpatterns = [
    path(
        '',
        NotificationListAPIView.as_view(),
        name='notification_list'
    ),
    path(
        'all/',
        AllNotificationsAPIView.as_view(),
        name='all_notifications'
    ),
    path(
        '<str:notification_id>/read/',
        MarkNotificationAsReadAPIView.as_view(),
        name='mark_notification_as_read'
    ),
]
