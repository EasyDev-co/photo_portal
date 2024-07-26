from django.urls import path

from apps.cart.api.v1.views import CartAPIView

urlpatterns = [
    path('cart/', CartAPIView.as_view(), name='cart'),
]