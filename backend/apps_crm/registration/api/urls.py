from django.urls import path, include


urlpatterns = [
    path('v1/registration/', include('apps_crm.registration.api.v1.urls')),
]
