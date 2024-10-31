from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from config import settings
from config.redoc import schema_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.order.api.urls')),
    path('api/', include('apps.user.api.urls')),
    path('api/', include('apps.photo.api.urls')),
    path('api/', include('apps.kindergarten.api.urls')),
    path('api/', include('apps.cart.api.urls')),
    path('api/', include('apps.promocode.api.urls')),
    path('api/crm/', include('apps_crm.notifications.api.urls')),
    path('api/crm/', include('apps_crm.registration.api.urls')),
    path('api/crm/', include('apps_crm.history.api.urls')),
    path('api/crm/', include('apps_crm.client_cards.api.urls')),
    path('api/crm/', include('apps_crm.roles.api.urls')),
    path('api/oauth/', include('apps.oauth.api.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
