from django.urls import path

from apps.order.api.v1.views import PhotoCartAPIView, OrderAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('cart/', PhotoCartAPIView.as_view(), name='cart'),
]
