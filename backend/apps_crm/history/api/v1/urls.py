from django.urls import path

from apps_crm.history.api.v1.views import UserHistoryView

urlpatterns = [
    path(
        '',
        UserHistoryView.as_view(),
        name='user_history'
    ),
]
