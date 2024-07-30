from urllib.parse import parse_qsl

from django.contrib import admin
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.safestring import mark_safe
from rest_framework.exceptions import ValidationError
from django.contrib import messages

from apps.kindergarten.models import Region
from apps.photo.models import (Photo,
                               PhotoTheme,
                               PhotoLine,
                               Coefficient)
from apps.photo.models.photo_theme import PhotoPopularityStat
from apps.utils.services.calculate_photo_popularity import (
    get_prepared_data,
    calculate_popularity
)

from config.settings import PHOTO_LINE_URL
from apps.utils.services import generate_qr_code
from django.core.files.base import ContentFile


class CustomMessageMixin:
    def save_model(self, request, obj, form, change):
        try:
            obj.save()
        except ValidationError as e:
            messages.set_level(request, messages.ERROR)
            error_msg = ', '.join(e.detail)
            self.message_user(request, error_msg, level=messages.ERROR)


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 0
    ordering = ('number',)
    readonly_fields = ('photo_img',)

    @admin.display(description='Фото')
    def photo_img(self, obj):
        return mark_safe(f'<img src="{obj.photo.url}" width="200" height="200" />')


@admin.register(PhotoTheme)
class PhotoThemeAdmin(CustomMessageMixin, admin.ModelAdmin):
    list_display = (
        'name',
        'is_active',
        'date_start',
        'date_end'
    )
    list_filter = ('is_active',)
    search_fields = ('name',)
    ordering = ('name', 'date_start', 'date_end')


@admin.register(PhotoLine)
class PhotoLineAdmin(CustomMessageMixin, admin.ModelAdmin):
    list_display = ('photo_theme', 'kindergarten', 'photos')
    readonly_fields = ('qr_image', 'qr_code')
    raw_id_fields = ('photo_theme', 'kindergarten')
    inlines = [
        PhotoInline
    ]

    def photos(self, obj):
        return ",".join([str(p.number) for p in obj.photos.all()])

    @admin.display(description='QR код')
    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        obj = form.instance
        kindergarten_code = obj.kindergarten.code
        photo_numbers = []

        for formset in formsets:
            for inline_form in formset.forms:
                if 'DELETE' not in inline_form.changed_data and inline_form.is_valid():
                    photo_numbers.append(inline_form.instance.number)

        qr_code, buffer = generate_qr_code(
            photo_line_id=obj.id,
            url=PHOTO_LINE_URL,
            kindergarten_code=kindergarten_code,
            photo_numbers=photo_numbers,
        )

        obj.qr_code.save(
            f'{str(obj.photo_theme.name)}_qr.png',
            ContentFile(buffer.read())
        )


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('photo_line', 'number', 'photo')
    raw_id_fields = ('photo_line',)
    readonly_fields = ('photo_img',)

    @admin.display(description='Фото')
    def photo_img(self, obj):
        if obj:
            return mark_safe(f'<img src="{obj.photo.url}" width="200" height="200" />')


class RegionFilter(admin.SimpleListFilter):
    title = 'Регион'
    parameter_name = 'region'

    def lookups(self, request, model_admin):
        regions = Region.objects.all()
        return [(region.id, region.name) for region in regions]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(photo_lines__kindergarten__region__id=self.value()).distinct()
        return queryset


@admin.register(PhotoPopularityStat)
class PhotoPopularityStatAdmin(admin.ModelAdmin):
    list_display = ('name',)
    list_filter = (RegionFilter,)
    ordering = ('name',)
    change_form_template = 'admin/photo/photopopularitystat/change_form.html'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def change_view(self, request, object_id, form_url="", extra_context=None):
        """Кастомное представление для отображения статистики."""
        try:
            query_params = dict(parse_qsl(request.GET['_changelist_filters']))
            region_id = query_params.get('region')
        except (MultiValueDictKeyError, ValueError):
            region_id = None

        extra_context = extra_context or {}

        prepared_data = get_prepared_data(
            photo_theme_id=object_id,
            region_id=region_id,
        )
        popularity = calculate_popularity(prepared_data)

        extra_context['popularity'] = popularity
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(Coefficient)
class CoefficientAdmin(admin.ModelAdmin):
    list_display = (
        'photo_type',
        'coefficient'
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
