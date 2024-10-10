from django.urls import path, include


urlpatterns = [
    path('v1/notifications/', include('apps_crm.notifications.api.v1.urls')),
]
