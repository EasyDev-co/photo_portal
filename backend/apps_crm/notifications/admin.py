from django.contrib import admin

from apps_crm.notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    pass
