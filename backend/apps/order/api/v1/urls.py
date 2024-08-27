from django.urls import path

from apps.order.api.v1.views import (OrderAPIView,
                                     OldCartAPIView,
                                     OldOrderAPIView,
                                     OldOrderOneAPIView,
                                     PaymentAPIView,
                                     GetPaymentStateAPIView)

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('old_order/', OldOrderAPIView.as_view(), name='old_order'),
    path('old_order/<uuid:pk>', OldOrderOneAPIView.as_view(), name='old_one_order'),
    path('old_cart/', OldCartAPIView.as_view(), name='old_cart'),
    path('payment/<uuid:pk>', PaymentAPIView.as_view(), name='payment'),
    path('get_state/<int:pk>', GetPaymentStateAPIView.as_view(), name='get_state'),
    path('get_paid_orders/', OrderAPIView.as_view(), name='get_paid_orders'),
]
