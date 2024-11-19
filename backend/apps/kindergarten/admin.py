from django.contrib import admin
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from apps.kindergarten.models.region import Region
from apps.kindergarten.models.photo_price import PhotoPrice, PhotoType
from apps.kindergarten.form import KindergartenForm
from .models import Ransom

from apps.kindergarten.models.kindergarten import Kindergarten

from config.settings import UPLOAD_URL, JQUERY_CDN


class KindergartenInline(admin.TabularInline):
    model = Kindergarten
    extra = 0
    readonly_fields = ['name', 'locality', 'code', 'has_photobook']
    exclude = ['qr_code', ]
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class PhotoPriceInline(admin.TabularInline):
    model = PhotoPrice
    extra = 0
    readonly_fields = ['price', 'photo_type']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Kindergarten)
class KindergartenAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'code', 'has_photobook', 'locality', 'active_photo_theme')
    list_filter = ('region', 'locality')
    search_fields = ('name', 'code')
    readonly_fields = ('qr_image', 'qr_code', 'file_upload', 'manager_info', 'active_photo_theme')
    raw_id_fields = ('region',)
    ordering = ('name',)

    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')

    def get_fields(self, request, obj=None):
        if obj:
            return ('region', 'locality', 'name', 'code', 'has_photobook', 'qr_image', 'qr_code', 'file_upload',
                    'manager_info', 'active_photo_theme')
        return 'region', 'locality', 'name', 'code', 'has_photobook'

    def file_upload(self, obj):
        has_active_theme = obj.kindergartenphototheme.filter(is_active=True).exists()

        if not has_active_theme:
            return "Добавьте активную фотосессию, чтобы загружать фото"

        form = KindergartenForm(initial={'kindergarten_id': obj.id})
        context = {
            'form': form,
            'upload_url': UPLOAD_URL,
            'object': obj,
            'jquery_cdn': JQUERY_CDN
        }
        html = render_to_string('admin/widgets/drag_and_drop.html', context)
        return mark_safe(html)

    def manager_info(self, obj):
        """Отображает информацию о заведующей, связанной с детским садом."""
        manager = obj.manager
        if manager:
            email = manager.email
            password = manager.un_hashed_password or "Пароль недоступен"
            return mark_safe(f"<strong>Email:</strong> {email}<br><strong>Password:</strong> {password}")
        return "Заведующая не назначена"

    manager_info.short_description = "Информация о заведующей"

    @staticmethod
    def _deactivate_other_themes(obj):
        """Деактивирует все активные фототемы для данного д/с."""
        obj.kindergartenphototheme.filter(is_active=True).update(is_active=False)


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

    def get_form(self, request, obj=None, **kwargs):
        """Исключение подарочных типов продукции из выбора"""
        form = super().get_form(request, obj, **kwargs)
        restricted_photo_types = [PhotoType.free_calendar, PhotoType.digital]
        form.base_fields['photo_type'].choices = [
            (choice_value, choice_display) for choice_value, choice_display in form.base_fields['photo_type'].choices
            if choice_value not in restricted_photo_types
        ]
        return form


@admin.register(Ransom)
class RansomAdmin(admin.ModelAdmin):
    list_display = ('kindergarten', 'photo_theme', 'ransom_amount', 'average_bill')
    list_filter = ('kindergarten', 'photo_theme')
    list_per_page = 20  # Устанавливает количество записей на странице

    # Настройка отображения связанных полей
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('kindergarten', 'photo_theme')
