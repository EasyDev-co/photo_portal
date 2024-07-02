from django.urls import path

from apps.order.api.v1.views import CartGetAddAPIView, OrderAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order_list'),
    path('cart/', CartGetAddAPIView.as_view(), name='cart'),
]
