from auditlog.models import LogEntry
from apps_crm.utils.repsitory.base import BaseRepository


class HistoryRepository(BaseRepository[LogEntry]):
    """Репозиторий для работы с Auditlog"""
