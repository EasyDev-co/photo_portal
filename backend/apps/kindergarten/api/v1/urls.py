from django.urls import path

from apps.kindergarten.api.v1.views import PhotoPriceAPIView


urlpatterns = [
    path('photo_price_by_region/', PhotoPriceAPIView.as_view(), name='photo_price'),
]
