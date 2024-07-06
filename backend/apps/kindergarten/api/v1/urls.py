from django.urls import path

from apps.kindergarten.api.v1.views import PhotoPriceAPIView


urlpatterns = [
    path('photo_price/', PhotoPriceAPIView.as_view(), name='photo_price'),
]
