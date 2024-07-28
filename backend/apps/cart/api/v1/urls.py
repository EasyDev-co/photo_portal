from django.urls import path

from apps.cart.api.v1.views import CartAPIView, PhotoInCartAPIView, CartPhotoLineAPIView

urlpatterns = [
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/photo_in_cart/', PhotoInCartAPIView.as_view(), name='photo_in_cart'),
    path('cart/cart_photo_line/', CartPhotoLineAPIView.as_view(), name='cart_photo_line'),
]
