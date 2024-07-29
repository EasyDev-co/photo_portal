from django.urls import path

from apps.order.api.v1.views import OrderAPIView, OldCartAPIView, OldOrderAPIView, OldOrderOneAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('old_order/', OldOrderAPIView.as_view(), name='old_order'),
    path('old_order/<uuid:pk>', OldOrderOneAPIView.as_view(), name='old_one_order'),
    path('old_cart/', OldCartAPIView.as_view(), name='old_cart'),
]
