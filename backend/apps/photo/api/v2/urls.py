from django.urls import path, include

from apps.photo.api.v2.views import (
   PhotoUploadView,
   PhotoLineGetByPhotoNumberAPIView,
   PhotoLineGetUpdateParentAPIView,
   GetPhotoThemeForCalendarView,
   PhotoUploadAPIView,
   DirectPhotoUploadAPIView,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'photo-themes', GetPhotoThemeForCalendarView, basename='photo-theme')

urlpatterns = [
   path('upload_photos/', PhotoUploadView.as_view(), name='upload_photos'),
   path('upload_photos_go/', PhotoUploadAPIView.as_view(), name='upload_photos_go'),
   path('save_photos/', DirectPhotoUploadAPIView.as_view(), name='save_photos'),
   path('photo_line_by_numbers/', PhotoLineGetByPhotoNumberAPIView.as_view(), name='photo_line_by_numbers'),
   path('photo_line/<uuid:pk>/', PhotoLineGetUpdateParentAPIView.as_view(), name='photo_line'),
   path('', include(router.urls)),
]
