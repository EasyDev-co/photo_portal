from django.contrib import admin

from apps_crm.notifications.models import Notification
from django.conf import settings


if settings.SHOW_IN_ADMIN:
    @admin.register(Notification)
    class NotificationAdmin(admin.ModelAdmin):
        pass
