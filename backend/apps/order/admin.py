from django.contrib import admin

from apps.order.models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order_price',
        'user',
        'kindergarten',
        'status',
        'is_digital',
        'created',
        'modified',
    )
    list_filter = ('status', 'kindergarten')
    search_fields = ('user',)
    raw_id_fields = ('user', 'kindergarten')
    readonly_fields = (
        'order_price',
        'status',
        'created',
        'modified',
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'photo_type',
        'amount',
        'order',
        'photo',
        'created',
        'modified'
    )
    list_filter = ('order', 'photo_type')
    readonly_fields = (
        'amount',
        'created',
        'modified',
    )
