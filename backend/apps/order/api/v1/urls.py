from django.urls import path

from apps.order.api.v1.views import CartAPIView, PhotoCartAPIView, OrderAPIView, OrderOneAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('order/<uuid:pk>', OrderOneAPIView.as_view(), name='one_order'),
    path('cart/photo/', PhotoCartAPIView.as_view(), name='photo_cart'),
    path('cart/', CartAPIView.as_view(), name='cart'),
]
