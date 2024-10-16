from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps_crm.roles.models import ClientCard, Employee


class ClientCardService:
    @staticmethod
    @transaction.atomic
    def assign_responsible_manager(client_card_ids, manager_id):
        """
        Присваивает менеджера по списку карточек клиентов.

        client_card_ids: Список ID карточек клиентов
        manager_id: ID ответственного менеджера
        """
        try:
            manager = Employee.objects.get(id=manager_id)
        except Employee.DoesNotExist:
            raise ValidationError(f"Менеджер с ID {manager_id} не найден.")

        client_cards = ClientCard.objects.filter(id__in=client_card_ids)

        if not client_cards.exists():
            raise ValidationError("Карточки клиентов не найдены.")

        for client_card in client_cards:
            client_card.responsible_manager = manager
            client_card.save()

        return client_cards

    @staticmethod
    @transaction.atomic
    def remove_responsible_manager(client_card_ids):
        """
        Удаляет менеджера по списку карточек клиентов.

        client_card_ids: Список ID карточек клиентов
        """
        client_cards = ClientCard.objects.filter(id__in=client_card_ids)

        if not client_cards.exists():
            raise ValidationError("Карточки клиентов не найдены.")

        for client_card in client_cards:
            client_card.responsible_manager = None
            client_card.save()

        return client_cards
