from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.kindergarten.models.region import Region
from apps.kindergarten.models.kindergarten import Kindergarten
from apps.kindergarten.models.photo_price import PhotoPrice, PhotoType


@admin.register(Kindergarten)
class KindergartenAdmin(admin.ModelAdmin):
    list_display = (
        'region',
        'name',
        'code',
        'has_photobook'
    )
    list_filter = ('region',)
    search_fields = ('name', 'code')
    readonly_fields = ('image_tag', 'qr_code')

    def image_tag(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ransom_amount')


@admin.register(PhotoPrice)
class PhotoPriceAdmin(admin.ModelAdmin):
    list_display = ('price', 'photo_type', 'region')
