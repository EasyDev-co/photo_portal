from django.urls import path

from apps.photo.api.v2.views import (
   PhotoUploadView,
   PhotoLineGetByPhotoNumberAPIView,
   PhotoLineGetUpdateParentAPIView,
)

urlpatterns = [
   path('upload_photos/', PhotoUploadView.as_view(), name='upload_photos'),
   path('photo_line_by_numbers/', PhotoLineGetByPhotoNumberAPIView.as_view(), name='photo_line_by_numbers'),
   path('photo_line/<uuid:pk>/', PhotoLineGetUpdateParentAPIView.as_view(), name='photo_line'),
]
