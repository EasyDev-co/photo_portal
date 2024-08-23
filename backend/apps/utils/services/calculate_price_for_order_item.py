from decimal import Decimal

from apps.exceptions.api_exceptions import PhotoPriceDoesNotExist
from apps.kindergarten.models import PhotoType
from apps.order.models import OrderItem
from apps.promocode.models import Promocode


def calculate_price_for_order_item(
        order_item: OrderItem,
        prices_dict: dict,
        ransom_amount: Decimal,
        promocode: Promocode = None
):
    """Подсчет стоимости позиции заказа с учетом промокода и суммы выкупа."""
    try:
        if order_item.photo_type == PhotoType.digital and order_item.order.order_price >= ransom_amount:
            order_item.price = Decimal(0)
            return
        photo_price = prices_dict[order_item.photo_type]
        price = order_item.amount * photo_price
        if promocode is None:
            order_item.price = Decimal(price)
            return
        if order_item.photo_type == PhotoType.photobook:
            order_item.price = promocode.apply_discount(Decimal(price), is_photobook=True)
        else:
            order_item.price = promocode.apply_discount(Decimal(price), is_photobook=False)
    except KeyError:
        raise PhotoPriceDoesNotExist
