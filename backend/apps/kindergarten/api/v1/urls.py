from django.urls import path

from apps.kindergarten.api.v1.views import (
    PhotoPriceAPIView,
    KindergartenStatsAPIView,
    KindergartenSearchAPIView,
    RegionSearchAPIView,
    KindergartenAutocomplete,
)


urlpatterns = [
    path('photo_price_by_region/', PhotoPriceAPIView.as_view(), name='photo_price'),
    path('stats/', KindergartenStatsAPIView.as_view(), name='kindergarten_stats'),
    path('kindergartens/search/', KindergartenSearchAPIView.as_view(), name='kindergarten-search'),
    path('region/search/', RegionSearchAPIView.as_view(), name='region-search'),
    path('kindergarten-autocomplete/', KindergartenAutocomplete.as_view(), name='kindergarten-autocomplete'),
]
