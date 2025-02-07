from urllib.parse import parse_qsl

from django.core.exceptions import ValidationError
from django.utils.html import format_html
from django.contrib import admin
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.safestring import mark_safe
from django.contrib import messages
from django.urls import reverse

from apps.kindergarten.models import Region
from apps.photo.form import PhotoThemeForm
from apps.photo.models import (Photo,
                               PhotoTheme,
                               PhotoLine,
                               Coefficient,
                               UserPhotoCount,
                               Season,
                               )
from apps.photo.models.photo_theme import PhotoPopularityStat, PhotoThemeName
from apps.utils.services.calculate_photo_popularity import (
    get_prepared_data,
    calculate_popularity
)
from apps.utils.services.update_photo_theme_kindergartens import update_photo_theme_kindergarten


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
    exclude = ('watermarked_photo',)

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            try:
                obj.delete()
                self.message_user(request, f"Фотография {obj} успешно удалена.", level=messages.SUCCESS)
            except ValidationError as e:
                self.message_user(request, f"Ошибка при удалении {obj}: {e}", level=messages.ERROR)


@admin.register(PhotoTheme)
class PhotoThemeAdmin(admin.ModelAdmin):
    form = PhotoThemeForm
    list_display = (
        'name',
        'get_kindergarten_name_link',
        'get_kindergarten_region',
        'get_kindergarten_locality',
        'season',
        'date_start',
        'date_end',
        'ongoing',
    )
    fields = (
        'photo_theme_name',
        'season',
        'kindergarten',
        'date_start',
        'date_end',
        'are_qrs_removed',
    )
    readonly_fields = ('are_qrs_removed', 'season',)
    search_fields = ('name',)
    ordering = ('name', 'date_start', 'date_end')

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        result = update_photo_theme_kindergarten(form, obj)
        if isinstance(result, dict):
            self.message_user(
                request,
                message=result.get('message'),
                level=messages.WARNING
            )

    def season(self, obj):
        return obj.photo_theme_name.season if obj.photo_theme_name else '-'

    season.short_description = 'Сезон'

    def get_kindergarten_name_link(self, obj):
        kindergarten = obj.get_kindergarten()
        if kindergarten:
            url = reverse(
                'admin:kindergarten_kindergarten_change',
                args=[kindergarten.id]
            )
            return format_html(
                '<a href="{url}">{name}</a>'.format(url=url, name=obj.get_kindergarten_name())
            )
        return "-"

    get_kindergarten_name_link.short_description = 'Детский сад'


@admin.register(PhotoThemeName)
class PhotoThemeNameAdmin(admin.ModelAdmin):
    list_display = ('name', 'season')


@admin.register(PhotoLine)
class PhotoLineAdmin(CustomMessageMixin, admin.ModelAdmin):
    list_display = ('kindergarten', 'photo_theme', 'parent', 'photos')
    readonly_fields = ('qr_image', 'qr_code')
    raw_id_fields = ('photo_theme', 'kindergarten')
    search_fields = (
        'kindergarten__name',
        'parent__first_name',
        'parent__last_name',
        'parent__email',
        'kindergarten__region__name',
    )
    list_filter = ('photo_theme', )
    inlines = [PhotoInline]

    def photos(self, obj):
        return ",".join([str(p.number) for p in obj.photos.all()])

    @admin.display(description='QR код')
    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')
        return 'Недоступно'


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('photo_line', 'number', 'photo_path')
    exclude = ('watermarked_photo',)
    raw_id_fields = ('photo_line',)
    readonly_fields = ('photo_path', 'watermarked_photo_path', 'display_photo', 'display_watermarked_photo')

    def display_photo(self, obj):
        if obj.photo_path:
            return format_html('<img src="{}" style="max-height:200px;"/>', obj.photo_path)
        return "Нет изображения"

    display_photo.short_description = "Оригинальная фотография"

    def display_watermarked_photo(self, obj):
        if obj.watermarked_photo_path:
            return format_html('<img src="{}" style="max-height:200px;"/>', obj.watermarked_photo_path)
        return "Нет изображения"

    display_watermarked_photo.short_description = "Фото с водяным знаком"

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            try:
                obj.delete()
                self.message_user(request, f"Фотография {obj} успешно удалена.", level=messages.SUCCESS)
            except ValidationError as e:
                self.message_user(request, f"Ошибка при удалении {obj}: {e}", level=messages.ERROR)


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


@admin.register(UserPhotoCount)
class UserPhotoCountAdmin(admin.ModelAdmin):
    list_display = ('user', 'photo_theme', 'count')
    readonly_fields = ('user', 'photo_theme')

    def has_add_permission(self, request):
        return False


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('season',)
