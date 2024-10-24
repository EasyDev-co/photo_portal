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
    list_display = ('name', 'region', 'code', 'has_photobook', 'locality')
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
            return ('region', 'name', 'code', 'has_photobook', 'qr_image', 'qr_code')
        return ('region', 'name', 'code', 'has_photobook')


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ransom_amount_for_digital_photos', 'ransom_amount_for_calendar')
    ordering = ('name',)
    search_fields = ('name', 'ransom_amount_for_digital_photos', 'ransom_amount_for_calendar')
    inlines = [KindergartenInline, PhotoPriceInline]


@admin.register(PhotoPrice)
class PhotoPriceAdmin(admin.ModelAdmin):
    list_display = ('get_price_display', 'photo_type', 'region')
    raw_id_fields = ('region',)
    ordering = ('region',)

    def get_price_display(self, obj):
        if obj.region:
            return f'Цена для {obj.region.name}: {obj.price}'
        return f'Общая цена для остальных регионов: {obj.price}'

    get_price_display.short_description = 'Цены для регионов'

    def save_model(self, request, obj, form, change):
        if obj.region and obj.region.name in ['Москва', 'Санкт-Петербург'] and obj.price == 0:
            raise ValueError(f'Необходимо указать цену для региона {obj.region.name}.')

        if not obj.region:
            regions = Region.objects.exclude(name__in=['Москва', 'Санкт-Петербург'])
            for region in regions:
                if not PhotoPrice.objects.filter(region=region, photo_type=obj.photo_type).exists():
                    PhotoPrice.objects.create(
                        price=obj.price,
                        region=region,
                        photo_type=obj.photo_type
                    )
            self.message_user(
                request,
                'Цены успешно добавлены для всех регионов, кроме Москвы и Санкт-Петербурга.'
            )
            return
        super().save_model(request, obj, form, change)
