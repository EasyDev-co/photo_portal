from django.urls import path

from apps.cart.api.v2.views import CartV2APIView

urlpatterns = [
    path('cart/', CartV2APIView.as_view(), name='cart'),
]
