from django.contrib import admin

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
    )
    readonly_fields = (
        'created',
        'modified',
        'activate_count'
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields


@admin.register(BonusCoupon)
class BonusCouponAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'balance',
        'created',
        'modified',
    )
    raw_id_fields = ('user',)
