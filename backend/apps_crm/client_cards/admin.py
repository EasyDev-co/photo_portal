from django.contrib import admin
from .models import ClientCard, Notes, HistoryCall, ClientCardTask
from django.conf import settings


if settings.SHOW_IN_ADMIN:
    @admin.register(ClientCard)
    class ClientCardAdmin(admin.ModelAdmin):
        list_display = ('kindergarten', 'responsible_manager', 'status', 'charges', 'charge_dates')
        list_filter = ('status', 'city', 'responsible_manager')
        search_fields = ('kindergarten__name', 'last_photographer', 'city', 'address')
        fieldsets = (
            (None, {
                'fields': ('kindergarten', 'children_count', 'children_for_photoshoot', 'responsible_manager', 'last_photographer')
            }),
            ('Контактные данные', {
                'fields': ('garden_details', 'city', 'address')
            }),
            ('Статус и сборы', {
                'fields': ('status', 'charges', 'charge_dates',)
            }),
        )


    @admin.register(Notes)
    class NotesAdmin(admin.ModelAdmin):
        list_display = ('text', 'priority', 'author', 'client_card', 'created_at')
        list_filter = ('priority', 'author')
        search_fields = ('text', 'author__user__first_name', 'author__user__last_name')
        list_editable = ('priority',)
        ordering = ('-created_at',)


    @admin.register(HistoryCall)
    class HistoryCallAdmin(admin.ModelAdmin):
        list_display = ('call_status', 'author', 'client_card', 'created_at')
        list_filter = ('call_status', 'author')
        search_fields = ('author__user__first_name', 'author__user__last_name', 'client_card__kindergarten__name')
        ordering = ('-created_at',)


    @admin.register(ClientCardTask)
    class ClientCardTaskAdmin(admin.ModelAdmin):
        list_display = ('text', 'author', 'client_card', 'task_status', 'task_type', 'created_at', 'date_end')
        list_filter = ('task_status', 'task_type', 'author')
        search_fields = ('text', 'author__user__first_name', 'author__user__last_name', 'client_card__kindergarten__name')
        ordering = ('-created_at',)
        fieldsets = (
            (None, {
                'fields': ('author', 'executor', 'client_card', 'text', 'task_type')
            }),
            ('Статус и срок выполнения', {
                'fields': ('task_status', 'date_end')
            }),
        )
        date_hierarchy = 'created_at'
