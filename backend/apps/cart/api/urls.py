from django.urls import path, include


urlpatterns = [
    path('v1/', include('apps.cart.api.v1.urls')),
]
