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
    modified = models.DateTimeField(auto_now=True, verbose_name="Изменен")

    class Meta:
        verbose_name = 'Карточка клиента'
        verbose_name_plural = 'Карточки клиента'

    @property
    def kindergarten_name(self) -> str:
        if self.kindergarten:
            return self.kindergarten.name
        return "Ошибка имени"

    @property
    def manager_bonus(self):
        manager = getattr(self.kindergarten, 'manager', None)
        if manager:
            return getattr(manager, 'manager_percent', "Процент не указан")
        return "Процент не указан"

    @property
    def promocode_size(self):
        manager = getattr(self.kindergarten, 'manager', None)
        if manager:
            return getattr(manager, 'manager_discount', "Скидка не указана")
        return "Скидка не указана"

    @property
    def responsible_manager_fi(self) -> str:
        """Возвращает имя и фамилию исполнителя задачи, если они существуют."""
        if self.responsible_manager and self.responsible_manager.user:
            first_name = self.responsible_manager.user.first_name or "Без имени"
            last_name = self.responsible_manager.user.last_name or "Без фамилии"
            return f"{first_name} {last_name}"
        return "Ответственный менеджер не указан"

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
    DONE = 2, "Выполнена"

class ReviewTaskStatus(models.IntegerChoices):
    TO_BE_FINALIZED = 1, "Доработать"
    FAIL = 2, "Провалить"
    ACCEPT = 3, "Принять"

class TaskType(models.IntegerChoices):
    CALL = 1, "Звонок"
    COLLECTING_PAYMENT_SEND_LINK = 2, "Сбор оплаты+ отправка ссылок"
    ACCEPT_ORDER = 3, "Принять заказ",
    CALL_COLD_LISTS = 4, "Позвонить холодный/списки"
    CHECK_SENDING_SAMPLE = 5, "Проверить отправку образцов, Готовые фото."
    WARM_KINDERGARTENS = 6, "Теплые сады"
    REMIND_ABOUT_APPOINTMENT = 7, "Напомнить о записи"
    CALL_KP_CHECK_WATS_APP = 8, "Позвонить по КП, Проверить смс по Вотсапп"


class TaskManagerReview(models.IntegerChoices):
    ACCEPT = 1, "Принять"
    FAIL = 2, "Провалить"
    TO_BE_FINALIZED = 3, "Доработать"

class ClientCardTask(models.Model):
    """Задачи к карточке клиентов"""
    author = models.ForeignKey(
        Employee,
        verbose_name="Автор задачи",
        on_delete=models.CASCADE,
        related_name="authored_client_card_tasks"
    )
    executor = models.ForeignKey(
        Employee,
        verbose_name="Исполнитель",
        on_delete=models.CASCADE,
        related_name="executed_client_card_tasks",
        null=True,
        blank=True
    )
    client_card = models.ForeignKey(
        ClientCard,
        on_delete=models.CASCADE,
        verbose_name="Карточка клиента",
        related_name="client_card_task",
        null=True,
        blank=True,
    )
    review_task_status = models.PositiveSmallIntegerField(
        verbose_name="Статус ревью", choices=ReviewTaskStatus.choices, default=ReviewTaskStatus.ACCEPT
    )
    text = models.TextField(max_length=2048, verbose_name="Описание", null=True, blank=True)
    revision_comment = models.TextField(max_length=2048, verbose_name="", null=True, blank=True)
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

    @property
    def author_fi(self) -> str:
        """Возвращает имя и фамилию автора задачи, если они существуют."""
        if self.author and self.author.user:
            first_name = self.author.user.first_name or "Без имени"
            last_name = self.author.user.last_name or "Без фамилии"
            return f"{first_name} {last_name}"
        return "Автор не указан"

    @property
    def executor_fi(self) -> str:
        """Возвращает имя и фамилию исполнителя задачи, если они существуют."""
        if self.executor and self.executor.user:
            first_name = self.executor.user.first_name or "Без имени"
            last_name = self.executor.user.last_name or "Без фамилии"
            return f"{first_name} {last_name}"
        return "Исполнитель не указан"

    @property
    def task_status_name(self) -> str:
        """Возвращает название текущего статуса задачи."""
        return self.get_task_status_display()

    @property
    def task_type_name(self) -> str:
        """Возвращает название текущего типа задачи."""
        return self.get_task_type_display()

    @property
    def review_task_status_name(self) -> str:
        return self.get_review_task_status_display()

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
