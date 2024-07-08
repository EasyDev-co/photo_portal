from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.child.models import Child
from apps.photo.models import Photo


class PhotoInLine(admin.TabularInline):
    model = Photo
    extra = 0
    ordering = ('number',)
    readonly_fields = ('photo_img',)

    @admin.display(description='Фото')
    def photo_img(self, obj):
        return mark_safe(f'<img src="{obj.photo.url}" width="200" height="200" />')


@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'parent',
        'kindergarten',
    )
    raw_id_fields = ('parent', 'kindergarten')
    search_fields = ('first_name', 'last_name', 'parent')
    list_filter = ('first_name', 'last_name', 'parent')
    inlines = (PhotoInLine,)
