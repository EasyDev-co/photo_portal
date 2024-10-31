from django.urls import path
from apps.promocode.api.v1.views import PromocodeRetrieveAPIView


urlpatterns = [
    path('/', PromocodeRetrieveAPIView.as_view(), name="promocode")
]
