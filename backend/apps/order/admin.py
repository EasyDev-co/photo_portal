from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.order.models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    verbose_name = 'Часть заказа'
    verbose_name_plural = 'Части заказа'
    readonly_fields = ('photo_img',)

    @admin.display(description='Фото')
    def photo_img(self, obj):
        return mark_safe(f'<img src="{obj.photo.photo.url}" width="200" height="200" />')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order_price',
        'user',
        'kindergarten',
        'photo_line',
        'status',
        'is_digital',
        'created',
        'modified',
    )
    list_filter = ('status', 'photo_line')
    search_fields = ('user__email',)
    raw_id_fields = ('user', 'photo_line')
    ordering = ('created', 'modified')
    readonly_fields = (
        'order_price',
        'created',
        'modified',
    )
    inlines = [
        OrderItemInline
    ]

    def kindergarten(self, instance):
        return instance.photo_line.kindergarten


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'photo_type',
        'amount',
        'price',
        'order',
        'photo',
        'created',
        'modified'
    )
    list_filter = ('order', 'photo_type')
    ordering = ('created', 'modified')
    search_fields = ('order__id', 'order__user__email')
    readonly_fields = (
        'created',
        'modified',
    )
