from django.urls import path

from apps.photo.api.v1.views import (PhotoRetrieveAPIView,
                                     PhotoRetieveByIdAPIView,
                                     PhotoLinesGetByParent,
                                     PhotoLineGetByPhotoNumberAPIView,
                                     CurrentPhotoThemeRetrieveAPIView,
                                     PhotoLineGetUpdateParentAPIView)

urlpatterns = [
    path('photo_by_id/<uuid:pk>/', PhotoRetieveByIdAPIView.as_view(), name='photo_by_id'),
    path('photo/<int:number>/', PhotoRetrieveAPIView.as_view(), name='photo'),
    path('photo_line/', PhotoLinesGetByParent.as_view(), name='photo_line_by_parent'),
    path('photo_line/<uuid:pk>/', PhotoLineGetUpdateParentAPIView.as_view(), name='photo_line'),
    path('photo_line_by_numbers/', PhotoLineGetByPhotoNumberAPIView.as_view(), name='photo_line_by_numbers'),
    path('current_photo_theme/<uuid:pk>/', CurrentPhotoThemeRetrieveAPIView.as_view(), name='current_photo_theme'),
]
