from django.urls import path, include


urlpatterns = [
    path('v1/roles/', include('apps_crm.roles.api.v1.urls')),
]
