from django.contrib import admin
from django.utils.safestring import mark_safe
from django.contrib.admin import DateFieldListFilter

from apps.order.models import Order, OrderItem
from django.conf import settings


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    verbose_name = 'Часть заказа'
    verbose_name_plural = 'Части заказа'
    readonly_fields = ('photo_img',)

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description='Фото')
    def photo_img(self, obj):
        return mark_safe(f'<img src="{obj.photo.photo.url}" width="200" height="200" />')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'payment_id',
        'order_price',
        'user',
        'kindergarten',
        'photo_line',
        'status',
        'is_digital',
        'is_photobook',
        'created',
        'modified',
    )
    list_filter = ('status', 'photo_line', 'is_digital', ('created', DateFieldListFilter))
    search_fields = ('user__email', 'photo_line__kindergarten__name', 'user__firstname', 'user__lastname')
    ordering = ('-created', 'modified')
    readonly_fields = (
        'id',
        'order_price',
        'user',
        'photo_line',
        'is_digital',
        'is_photobook',
        'created',
        'modified',
        'payment_id',
        'order_payment'
    )
    inlines = [
        OrderItemInline
    ]

    def kindergarten(self, instance):
        if instance.kindergarten:
            return instance.photo_line.kindergarten
        return "Нет детского сада"

if settings.SHOW_IN_ADMIN:
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
            'id',
            'photo_type',
            'amount',
            'price',
            'order',
            'photo',
            'created',
            'modified',
        )
