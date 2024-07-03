from django.contrib import admin

from apps.promocode.models import Promocode, PromocodePhotoTypes


class PromocodePhotoTypesInLine(admin.TabularInline):
    model = PromocodePhotoTypes
    extra = 0
    fields = ('photo_type', 'discount')


@admin.register(PromocodePhotoTypes)
class PromocodePhotoTypes(admin.ModelAdmin):
    list_display = (
        'promocode',
        'photo_type',
        'discount',
    )
    raw_id_fields = ('promocode',)


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
    inlines = (PromocodePhotoTypesInLine,)
