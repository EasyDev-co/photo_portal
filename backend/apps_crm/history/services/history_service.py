from django.contrib.auth import get_user_model

from apps_crm.history.repositories.history_repository import HistoryRepository

User = get_user_model()


class HistoryService:
    def __init__(self, history_repository: HistoryRepository):
        self.history_repository = history_repository

    def list_user_history(self, user: User):
        """Получить все уведомления для пользователя."""
        return self.history_repository.list(actor=user)
