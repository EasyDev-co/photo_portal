from django.db import models
from django.contrib.auth import get_user_model

from apps_crm.client_cards.models import ClientCard
from apps_crm.roles.models import Employee

User = get_user_model()


class ManagerChangeLog(models.Model):
    client_card = models.ForeignKey(
        ClientCard,
        on_delete=models.CASCADE,
        related_name="managers",
        verbose_name='Карточка клиента'
    )
    previous_manager = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        related_name="previous_managers",
        verbose_name='Прошлый менеджер'
    )
    new_manager = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        related_name="new_manager",
        verbose_name='Новый менеджер'
    )
    changed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Изменен в'
    )
