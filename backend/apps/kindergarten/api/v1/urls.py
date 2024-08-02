from django.urls import path

from apps.kindergarten.api.v1.views import (
    PhotoPriceAPIView,
    PhotoThemeRansomAPIView,
    KindergartenStatsAPIView
)


urlpatterns = [
    path('photo_price_by_region/', PhotoPriceAPIView.as_view(), name='photo_price'),
    path('ransom/<uuid:pk>', PhotoThemeRansomAPIView.as_view(), name='ransom'),
    path('stats/<uuid:pk>/', KindergartenStatsAPIView.as_view(), name='kindergarten_stats')
]
