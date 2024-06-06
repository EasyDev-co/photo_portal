from django.contrib import admin

from apps.kindergarten.models.region import Region
from apps.kindergarten.models.kindergarten import Kindergarten
from apps.kindergarten.models.photo_price import PhotoPrice, PhotoType


@admin.register(Kindergarten)
class KindergartenAdmin(admin.ModelAdmin):
    list_display = (
        'region',
        'name',
        'code',
        'qr_code',
        'has_photobook'
    )
    list_filter = ('region',)
    search_fields = ('name', 'code')
    readonly_fields = ('qr_code',)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ransom_amount')


@admin.register(PhotoPrice)
class PhotoPriceAdmin(admin.ModelAdmin):
    list_display = ('price', 'photo_type', 'region')
