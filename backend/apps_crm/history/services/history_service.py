from uuid import UUID

from django.contrib.auth import get_user_model

from apps_crm.history.repositories.history_repository import HistoryRepository

User = get_user_model()


class HistoryService:
    def __init__(self, history_repository: HistoryRepository):
        self.history_repository = history_repository

    def list_user_history(self, user: User):
        """Получить историю изменений пользвоателя."""
        return self.history_repository.list(actor=user)

    def list_object_history(self, model_name: str, object_id: UUID):
        """Получить историю изменений объекта."""
        return self.history_repository.list(
            object_pk=object_id, content_type__model=model_name
        )
