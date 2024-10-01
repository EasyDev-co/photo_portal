from django.db import transaction
from django.db.models import Sum

from apps.kindergarten.models import Ransom
from apps.order.models import Order
from apps.order.models.const import OrderStatus
from apps.photo.models import PhotoTheme
from config.celery import BaseTask, app
from django.utils import timezone as django_timezone


class CalculateRansomOfPastPhotoThemes(BaseTask):
    """
    Задача для подсчета сумм выкупа за прошедшие фототемы в д/с.
    """

    def run(self, **kwargs):
        # Достаем все оплаченные и/или завершенные заказы прошедших фототем
        orders = Order.objects.filter(
            status__in=(OrderStatus.paid_for, OrderStatus.completed),
            photo_line__photo_theme__date_end__lte=django_timezone.now(),
            photo_line__photo_theme__ransom_counted=False
        ).select_related('photo_line__photo_theme')

        # Группируем заказы по фототемам и суммируем цены заказов для каждой фототемы
        order_sums = orders.values(
            'photo_line__photo_theme',
            'photo_line__kindergarten'
        ).annotate(
            ransom_amount=Sum('order_price')
        )

        ransom_objects = []
        photo_theme_ids_to_update = set()

        # Обрабатываем заказы по прошедшей фототеме
        for item in order_sums:
            photo_theme_id = item['photo_line__photo_theme']

            # Добавляем объекты Ransom в список и собираем id фототемы
            ransom_objects.append(Ransom(
                kindergarten_id=item['photo_line__kindergarten'],
                photo_theme_id=photo_theme_id,
                ransom_amount=item['ransom_amount']
            ))
            photo_theme_ids_to_update.add(photo_theme_id)

        # Создаем записи о сумме выкупа в БД, и помечаем фототемы, как подсчитанные
        with transaction.atomic():
            Ransom.objects.bulk_create(ransom_objects)
            PhotoTheme.objects.filter(
                id__in=photo_theme_ids_to_update
            ).update(
                ransom_counted=True
            )


app.register_task(CalculateRansomOfPastPhotoThemes)
