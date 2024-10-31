from django.urls import path, include


urlpatterns = [
    path('v1/promocode/', include('apps.promocode.api.v1.urls')),
]
