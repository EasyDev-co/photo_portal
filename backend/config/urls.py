from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin

from config import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.parent.api.urls')),
    path('api/', include('apps.photo.api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
