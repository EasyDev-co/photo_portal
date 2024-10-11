from django.urls import path

from apps_crm.client_cards.api.v1.views import (
    ClientCardDetailView,
    ClientCardListView
)

urlpatterns = [
    path(
        '',
        ClientCardListView.as_view(),
        name='object_history'
    ),
    path(
        '<uuid:id>/',
        ClientCardDetailView.as_view(),
        name='user_history'
    ),

]
