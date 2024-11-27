from django.urls import path
from apps.promocode.api.v1.views import PromocodeRetrieveAPIView, PromocodeAPIView

urlpatterns = [
    path('get/', PromocodeRetrieveAPIView.as_view(), name="promocode"),
    path('get_manager_promocode/', PromocodeAPIView.as_view(), name="promocode")
]
