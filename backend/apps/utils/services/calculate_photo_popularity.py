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
            order__kindergarten__region_id=region_id
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
    total_divisor = 0
    aggregated_data = {}
    coefficients = dict(Coefficient.objects.all().values_list('photo_type', 'coefficient'))

    for data in prepared_data:
        coefficient: float = float(coefficients[data['photo_type']])
        total_divisor += data['amount'] * coefficient

    for data in prepared_data:
        photo_type = data['photo_type']
        serial_number = data['photo__serial_number']
        amount = data['amount']
        coefficient: float = float(coefficients[photo_type])

        popularity = (coefficient * amount) / total_divisor * 100

        if serial_number in aggregated_data:
            aggregated_data[serial_number] += popularity
        else:
            aggregated_data[serial_number] = popularity

    return [{'serial_number': k, 'popularity': round(v, 2)} for k, v in aggregated_data.items()]
