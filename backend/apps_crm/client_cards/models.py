from django.db import models

from apps.kindergarten.models.kindergarten import Kindergarten
from apps_crm.roles.models import Employee


class ClientCardStatus(models.IntegerChoices):
    CALLS = 1, "Звонки"
    PHOTOSHOOT_IN_PROGRESS = 2, "Идет фотосессия"
    SEAL_PHOTO = 3, "Печать фото"
    SELLING_PHOTOS = 4, "Продажа фото"


class ClientCard(models.Model):
    """Модель карточки клиента"""
    kindergarten = models.OneToOneField(
        Kindergarten,
        verbose_name="Сад",
        on_delete=models.CASCADE,
    )
    children_count = models.PositiveSmallIntegerField(default=0, verbose_name="Кол-во детей")
    children_for_photoshoot = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Кол-во детей на фотосессию"
    )
    responsible_manager = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name="client_cards",
        null=True,
        verbose_name="Ответственный менеджер",
    )
    last_photographer = models.CharField(max_length=256, verbose_name="Последний фотограф", null=True)
    garden_details = models.CharField(max_length=256, verbose_name="Реквизиты", null=True)
    city = models.CharField(max_length=128, verbose_name="Город", null=True)
    address = models.CharField(max_length=256, verbose_name="Адрес", null=True)
    status = models.PositiveSmallIntegerField(
        choices=ClientCardStatus.choices,
        default=ClientCardStatus.CALLS,
        verbose_name="Статус карточки клиента"
    )
    charges = models.PositiveSmallIntegerField(
        default=0,
        verbose_name='Сбор'
    )
    charge_dates = models.DateField(
        null=True,
        verbose_name='Дата сбора'
    )

    class Meta:
        verbose_name = 'Карточка клиента'
        verbose_name_plural = 'Карточки клиента'

    @property
    def kindergarten_name(self) -> str:
        if self.kindergarten:
            return self.kindergarten.name

    @property
    def manager_bonus(self):
        try:
            return self.responsible_manager.user.manager_bonuses.first().bonus_size
        except AttributeError:
            return

    @property
    def promocode_size(self):
        try:
            return self.responsible_manager.user.promo_codes.first().discount_services
        except AttributeError:
            return


class Notes(models.Model):
    """Заметки"""
    text = models.TextField(max_length=1024, verbose_name="Текст заметки")
    priority = models.BooleanField(default=False, verbose_name="Приоритет заметки")
    author = models.ForeignKey(
        Employee,
        verbose_name="Автор заметки",
        on_delete=models.CASCADE,
        related_name="notes"
    )
    client_card = models.ForeignKey(
        ClientCard,
        on_delete=models.CASCADE,
        verbose_name="Заметки",
        related_name="notes"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'


class CallHistory(models.IntegerChoices):
    REFUSAL = 1, "Отказ"
    BOOKED_PHOTOSHOOT = 2, "Записан на фотосессию"
    SENT_KP = 3, "Отправлено КП"


class HistoryCall(models.Model):
    """Модель звонков"""
    call_status = models.PositiveSmallIntegerField(
        choices=CallHistory.choices,
        verbose_name="Статус звонка",
        default=CallHistory.SENT_KP
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )
    author = models.ForeignKey(
        Employee,
        verbose_name="Автор звонка",
        on_delete=models.CASCADE,
        related_name="history_calls"
    )
    client_card = models.ForeignKey(
        ClientCard,
        on_delete=models.CASCADE,
        verbose_name="Карточка клиента",
        related_name="history_calls"
    )

    class Meta:
        verbose_name = 'История звонка'
        verbose_name_plural = 'История звонков'


class TaskStatus(models.IntegerChoices):
    OPEN = 1, "Открыта"
    IN_WORK = 2, "В работе"
    DONE = 3, "Готово"


class TaskType(models.IntegerChoices):
    CALL = 1, "Звонок"
    # TODO Уточнить еще статусы задачи


class ClientCardTask(models.Model):
    """Задачи к карточке клиентов"""
    author = models.ForeignKey(
        Employee,
        verbose_name="Автор задачи",
        on_delete=models.CASCADE,
        related_name="client_card_tasks"
    )
    client_card = models.ForeignKey(
        ClientCard,
        on_delete=models.CASCADE,
        verbose_name="Карточка клиента",
        related_name="client_card_task",
        null=True,
    )
    text = models.TextField(max_length=1024, verbose_name="Описание")
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время создания'
    )
    task_status = models.PositiveSmallIntegerField(
        verbose_name="Статус задачи", choices=TaskStatus.choices, default=TaskStatus.OPEN
    )
    task_type = models.PositiveSmallIntegerField(
        verbose_name="Тип задачи", choices=TaskType.choices, default=TaskType.CALL
    )
    date_end = models.DateTimeField(verbose_name="Дата окончания")

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
