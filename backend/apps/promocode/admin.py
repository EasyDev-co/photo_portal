from django.contrib import admin

from apps.promocode.models import Promocode


@admin.register(Promocode)
class PromocodeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'code',
        'created',
        'modified',
        'is_active',
    )
    readonly_fields = (
        'created',
        'modified',
    )
