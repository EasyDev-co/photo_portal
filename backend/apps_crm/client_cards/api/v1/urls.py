from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientCardTaskViewSet, NotesViewSet, HistoryCallViewSet, ClientCardViewSet

router = DefaultRouter()
router.register(r'client-card-tasks', ClientCardTaskViewSet, basename='clientcardtask')
router.register(r'client-cards', ClientCardViewSet, basename='clientcard')
router.register(r'notes', NotesViewSet, basename='notes')
router.register(r'history-calls', HistoryCallViewSet, basename='historycall')


urlpatterns = [
    path('', include(router.urls)),
]
