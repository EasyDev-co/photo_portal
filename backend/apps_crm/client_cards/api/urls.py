from django.urls import path, include


urlpatterns = [
    path('v1/client_cards/', include('apps_crm.client_cards.api.v1.urls')),
    path('v2/client_cards/', include('apps_crm.client_cards.api.v2.urls')),
]
