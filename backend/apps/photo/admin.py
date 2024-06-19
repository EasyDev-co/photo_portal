from django.contrib import admin
from django.utils.safestring import mark_safe
from rest_framework.exceptions import ValidationError
from django.contrib import messages

from apps.photo.models import (Photo,
                               PhotoTheme,
                               PhotoLine)


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


@admin.register(PhotoLine)
class PhotoLineAdmin(CustomMessageMixin, admin.ModelAdmin):
    list_display = ('photo_theme', 'kindergarten')
    readonly_fields = ('qr_image', 'qr_code')
    raw_id_fields = ('photo_theme', 'kindergarten')
    inlines = [
        PhotoInline
    ]

    @admin.display(description='QR код')
    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('photo_line', 'number', 'photo')
    raw_id_fields = ('photo_line',)
    readonly_fields = ('photo_img',)

    @admin.display(description='Фото')
    def photo_img(self, obj):
        if obj:
            return mark_safe(f'<img src="{obj.photo.url}" width="200" height="200" />')
