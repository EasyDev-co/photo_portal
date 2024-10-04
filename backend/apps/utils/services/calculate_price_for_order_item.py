from decimal import Decimal

from apps.exceptions.api_exceptions import PhotoPriceDoesNotExist
from apps.kindergarten.models import PhotoType
from apps.order.models import OrderItem
from apps.promocode.models import Promocode


def calculate_price_for_order_item(
        order_item: OrderItem,
        prices_dict: dict,
        ransom_amount_for_digital_photos: Decimal,
        promocode: Promocode = None,
        coupon_amount: list = None  # передаем через список, чтобы можно было изменять coupon_amount снаружи
):
    """Подсчет стоимости позиции заказа с учетом промокода и суммы выкупа."""
    try:
        if (order_item.photo_type == PhotoType.digital
                and order_item.order.order_price >= ransom_amount_for_digital_photos):
            order_item.price = Decimal(0)
            return
        photo_price = prices_dict[order_item.photo_type]
        price = order_item.amount * photo_price

        if promocode:
            if order_item.photo_type == PhotoType.photobook:
                price = promocode.apply_discount(Decimal(price), is_photobook=True)
            else:
                price = promocode.apply_discount(Decimal(price), is_photobook=False)

        if len(coupon_amount) != 0 and coupon_amount[0] != 0:
            coupon_amount[0] -= price
            if coupon_amount[0] >= 0:
                price = Decimal(0)
            else:
                price = abs(coupon_amount[0])
                coupon_amount[0] = Decimal(0)
        order_item.price = price
    except KeyError:
        raise PhotoPriceDoesNotExist
