from django.urls import path, include


urlpatterns = [
    path('parent/', include('apps.user.api.v1.parent.urls')),
]
