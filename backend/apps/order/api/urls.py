from django.urls import path, include


urlpatterns = [
    path('v1/', include('apps.order.api.v1.urls')),
]
