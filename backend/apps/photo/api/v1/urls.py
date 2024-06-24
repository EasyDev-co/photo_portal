from django.urls import path

from apps.photo.api.v1.views import (PhotoRetrieveAPIView,
                                     PhotoLineRetrieveAPIView,
                                     CurrentPhotoThemeRetrieveAPIView)

urlpatterns = [
    path('photo/<int:number>/', PhotoRetrieveAPIView.as_view(), name='photo'),
    path('photo_line/<uuid:pk>/', PhotoLineRetrieveAPIView.as_view(), name='photo_line'),
    path('current_photo_theme/<uuid:pk>/', CurrentPhotoThemeRetrieveAPIView.as_view(), name='current_photo_theme'),
]
