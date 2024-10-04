from django.urls import path

from apps_crm.history.api.v1.views import UserHistoryView, ObjectHistoryView

urlpatterns = [
    path(
        'user/',
        UserHistoryView.as_view(),
        name='user_history'
    ),
    path(
        'object/',
        ObjectHistoryView.as_view(),
        name='object_history'
    ),
]
