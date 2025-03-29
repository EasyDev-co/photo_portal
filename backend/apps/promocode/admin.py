from django.contrib import admin
from django.conf import settings

from apps.promocode.models import Promocode

from apps.promocode.models.bonus_coupon import BonusCoupon


@admin.register(Promocode)
class PromocodeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'code',
        'created',
        'modified',
        'is_active',
        'kindergarten'
    )
    readonly_fields = (
        'created',
        'modified',
        'activate_count',
        'kindergarten'
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields

    def kindergarten(self, obj):
        return obj.user.managed_kindergarten

    kindergarten.short_description = 'Детский сад'

if settings.SHOW_IN_ADMIN:
    @admin.register(BonusCoupon)
    class BonusCouponAdmin(admin.ModelAdmin):
        list_display = (
            'user',
            'balance',
            'created',
            'modified',
        )
        raw_id_fields = ('user',)
