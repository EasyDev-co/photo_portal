from django.db.models import Sum

from apps.order.models import OrderItem
from apps.photo.models.coefficient import Coefficient


def get_prepared_data(photo_theme_id, region_id=None):
    """Возвращает QuerySet для подсчета статистики."""
    query = OrderItem.objects.filter(
        photo__photo_line__photo_theme_id=photo_theme_id,
        photo_type__gt=0,
        order__status__gt=1
    )

    if region_id:
        query = query.filter(
            order__photo_line__kindergarten__region_id=region_id
        )

    return query.values(
        'photo__photo_line__photo_theme',
        'photo_type',
        'photo__serial_number'
    ).annotate(
        amount=Sum('amount')
    )


def calculate_popularity(prepared_data):
    """Подсчет статистики популярности фотографий с коэффициентом."""

    # Получаем коэффициенты для каждого типа фотографий
    coefficients = {photo_type: float(coef) for photo_type, coef in
                    Coefficient.objects.all().values_list('photo_type', 'coefficient')}

    # Подсчитываем общий делитель
    total_divisor = sum(data['amount'] * coefficients[data['photo_type']] for data in prepared_data)

    # Инициализируем словарь для агрегации данных
    aggregated_data = {i: 0 for i in range(1, 7)}

    # Расчет популярности для каждого фото
    for data in prepared_data:
        photo_type = data['photo_type']
        serial_number = data['photo__serial_number']
        amount = data['amount']
        coefficient = coefficients[photo_type]

        popularity = (coefficient * amount) / total_divisor * 100

        aggregated_data[serial_number] += popularity

    # Формируем итоговый список с округлением популярности до двух знаков
    return [{'serial_number': k, 'popularity': round(v, 2)} for k, v in aggregated_data.items()]
