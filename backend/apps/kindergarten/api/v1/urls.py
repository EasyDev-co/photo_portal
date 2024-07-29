from django.urls import path

from apps.kindergarten.api.v1.views import (
    PhotoPriceAPIView,
    PhotoThemeRansomAPIView,
    KindergartenListView
)


urlpatterns = [
    path('photo_price_by_region/', PhotoPriceAPIView.as_view(), name='photo_price'),
    path('ransom/<uuid:pk>', PhotoThemeRansomAPIView.as_view(), name='ransom'),
    path('kindergartens/', KindergartenListView.as_view(), name='kindergartens')
]
