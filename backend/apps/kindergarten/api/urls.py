from django.urls import path, include


urlpatterns = [
    path('v1/', include('apps.kindergarten.api.v1.urls')),
]
