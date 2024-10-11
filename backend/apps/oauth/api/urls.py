from django.urls import include, path

urlpatterns = [
    path('v1/', include('apps.oauth.api.v1.urls')),
]
