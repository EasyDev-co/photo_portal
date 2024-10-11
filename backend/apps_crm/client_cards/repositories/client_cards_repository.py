
from apps.kindergarten.models import Kindergarten
from apps_crm.utils.repsitory.base import BaseRepository


class ClientCardsRepository(BaseRepository[Kindergarten]):
    """Репозиторий для работы с карточками клиентов."""
