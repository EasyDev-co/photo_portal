from django.urls import path
from apps.order.api.v1.views import OrderAPIView

urlpatterns = [
    path('order/', OrderAPIView.as_view(), name='order_list'),
]
