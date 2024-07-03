from django.urls import path

from apps.order.api.v1.views import PhotoCartAPIView, OrderAPIView, OrderOneAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('order/<uuid:pk>', OrderOneAPIView.as_view(), name='one_order'),
    path('cart/', PhotoCartAPIView.as_view(), name='cart'),
]
