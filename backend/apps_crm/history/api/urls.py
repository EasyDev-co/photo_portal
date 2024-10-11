from django.urls import path, include


urlpatterns = [
    path('v1/history/', include('apps_crm.history.api.v1.urls')),
]
