from django.urls import path

from apps.order.api.v1.views import CartAPIView, OrderAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/<uuid:pk>', CartAPIView.as_view(), name='remove_from_cart')
]
