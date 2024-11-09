from django.utils import timezone

from apps_crm.client_cards.models import ClientCardTask, TaskStatus
from apps_crm.notifications.models import Notification
from apps_crm.roles.models import Employee, UserRole

from config.celery import BaseTask, app


class CreateNotifyForExpiredTask(BaseTask):
    """
    Задача на создание уведомлений, если задача была просрочена
    """
    name = "create_notify_for_expired_task"

    def process(self, *args, **kwargs):
        now = timezone.now()

        # Находим все открытые задачи, у которых дата окончания уже прошла
        expired_tasks = ClientCardTask.objects.filter(
            task_status=TaskStatus.OPEN,
            date_end__lt=now
        )

        for task in expired_tasks:
            # Вычисляем количество дней просрочки
            overdue_days = (now - task.date_end).days

            # Определяем текст уведомления
            message = (
                f"Задача '{task.text}' (Тип: {task.get_task_type_display()}) "
                f"просрочена на {overdue_days} дней."
            )

            # Создаем уведомление для SENIOR_MANAGER, если просрочено на 2 дня
            if overdue_days >= 2:
                self._notify_senior_manager(task, message)

            # Создаем уведомление для ROP, если просрочено на 4 дня
            if overdue_days >= 4:
                self._notify_role(UserRole.ROP, task, message)

            # Создаем уведомление для CEO, если просрочено на 6 дней
            if overdue_days >= 6:
                self._notify_role(UserRole.CEO, task, message)

    @staticmethod
    def _notify_senior_manager(task, message):
        """
        Создает уведомление для SENIOR_MANAGER, к которому прикреплен исполнитель задачи.
        """
        executor = task.executor
        if not executor or executor.employee_role != UserRole.MANAGER:
            return

        senior_manager = executor.manager
        if senior_manager:
            # Проверяем, не было ли уже создано такое уведомление
            if not Notification.objects.filter(
                user=senior_manager.user,
                message=message
            ).exists():
                Notification.objects.create(
                    user=senior_manager.user,
                    sender=executor.user,
                    message=message,
                    url=f""
                )

    @staticmethod
    def _notify_role(role, task, message):
        """
        Создает уведомления для всех пользователей с указанной ролью.
        """
        employees = Employee.objects.filter(
            employee_role=role,
            status="active"
        )
        for employee in employees:
            # Проверяем, не было ли уже создано такое уведомление
            if not Notification.objects.filter(
                user=employee.user,
                message=message
            ).exists():
                Notification.objects.create(
                    user=employee.user,
                    sender=task.executor.user if task.executor else None,
                    message=message,
                    url=f""
                )


app.tasks.register(CreateNotifyForExpiredTask())
