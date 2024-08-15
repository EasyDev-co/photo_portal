from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.kindergarten.models.region import Region
from apps.kindergarten.models.kindergarten import Kindergarten
from apps.kindergarten.models.photo_price import PhotoPrice


class KindergartenInline(admin.TabularInline):
    model = Kindergarten
    extra = 0
    fields = ('name', 'code', 'has_photobook')


class PhotoPriceInline(admin.TabularInline):
    model = PhotoPrice
    extra = 0


@admin.register(Kindergarten)
class KindergartenAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'region',
        'code',
        'has_photobook',
        'locality'
    )
    list_filter = ('region', 'locality')
    search_fields = ('name', 'code')
    readonly_fields = ('qr_image', 'qr_code')
    raw_id_fields = ('region',)
    ordering = ('name',)

    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')

    def get_fields(self, request, obj=None):
        if obj:
            return (
                'region',
                'name',
                'code',
                'has_photobook',
                'qr_image',
                'qr_code'
            )
        return (
            'region',
            'name',
            'code',
            'has_photobook'
        )


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ransom_amount')
    ordering = ('name',)
    search_fields = ('name', 'ransom_amount',)
    inlines = [
        KindergartenInline,
        PhotoPriceInline
    ]


@admin.register(PhotoPrice)
class PhotoPriceAdmin(admin.ModelAdmin):
    list_display = ('price', 'photo_type', 'region')
    raw_id_fields = ('region',)
    ordering = ('region',)
