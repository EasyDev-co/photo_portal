from django.contrib import admin

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart


class PhotoInCartInLine(admin.TabularInline):
    model = PhotoInCart
    extra = 0
    fields = (
        'photo',
        'photo_type',
        'quantity',
        'price_per_piece',
        'discount_price',
    )


class CartPhotoLineInLine(admin.TabularInline):
    model = CartPhotoLine
    extra = 0
    fields = (
        'photo_line',
        'is_digital',
        'is_photobook',
        'total_price',
    )


@admin.register(PhotoInCart)
class PhotoInCartAdmin(admin.ModelAdmin):
    list_display = (
        'photo',
        'cart_photo_line',
        'photo_type',
        'quantity',
        'price_per_piece',
        'discount_price',
    )


@admin.register(CartPhotoLine)
class CartPhotoLineAdmin(admin.ModelAdmin):
    list_display = (
        'cart',
        'photo_line',
        'is_digital',
        'is_photobook',
        'total_price'
    )
    inlines = (PhotoInCartInLine,)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'is_active',
    )
    inlines = (CartPhotoLineInLine,)
