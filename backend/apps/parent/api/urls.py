from django.urls import path, include

urlpatterns = [
    path('v1/parent/', include('apps.parent.api.v1.urls')),
]