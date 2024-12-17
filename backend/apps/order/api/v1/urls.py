from django.urls import path

from apps.order.api.v1.views import (
    OrderAPIView,
    OldCartAPIView,
    OldOrderAPIView,
    OldOrderOneAPIView,
    PaymentAPIView,
    GetPaymentStateAPIView,
    OrdersPaymentAPIView,
    NotificationFiscalizationAPIView,
    OrderManagerListAPIView
)

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order'),
    path('orders/<uuid:photo_theme_id>/<uuid:kindergarten_id>/',
         OrderManagerListAPIView.as_view(),
         name='order-list'
         ),
    path('old_order/', OldOrderAPIView.as_view(), name='old_order'),
    path('old_order/<uuid:pk>', OldOrderOneAPIView.as_view(), name='old_one_order'),
    path('old_cart/', OldCartAPIView.as_view(), name='old_cart'),
    path('payment/<uuid:pk>', PaymentAPIView.as_view(), name='payment'),
    path('get_state/<int:pk>', GetPaymentStateAPIView.as_view(), name='get_state'),
    path('get_paid_orders/', OrderAPIView.as_view(), name='get_paid_orders'),
    path('orders_payment/<uuid:pk>', OrdersPaymentAPIView.as_view(), name='orders_payment'),
    path('notification/', NotificationFiscalizationAPIView.as_view(), name='notification'),
]
