from django.urls import path, include


urlpatterns = [
    path('v1/photo/', include('apps.photo.api.v1.urls')),
]