from django.contrib import admin

from apps.order.models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order_price',
        'parent',
        'kindergarden',
        'status',
    )
    list_filter = ('status', 'kindergarden')
    search_fields = ('parent',)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'photo_type',
        'amount',
        'order',
        'photo',
    )
    list_filter = ('order', 'photo_type')
