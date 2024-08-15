from django.shortcuts import get_object_or_404

from apps.utils.services import CartService
from apps.utils.services import YaDiskApiService

from apps.order.models import Order, OrderItem
from apps.photo.models import Photo, PhotoLine


class OrderService:
    """Сервис создания заказов из корзины."""
    def __init__(self, user, cart_service: CartService):
        self.user = user
        self.cart_service = cart_service

    def create_orders(self):
        """Создать объекты заказов исходя из данных корзины и данных об электронных фото."""
        cart = self.cart_service.get_cart_by_user(self.user)
        orders = [
            Order(
                user=self.user,
                photo_line=get_object_or_404(PhotoLine, id=photo_line['id']),
                is_digital=photo_line['is_digital'],
                is_photobook=photo_line['is_photobook'],
                order_price=photo_line['total_price'],
            ) for photo_line in cart
        ]
        orders = Order.objects.bulk_create(orders)

        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)
        return orders

    def create_order_items(self, orders):
        cart = self.cart_service.get_cart_by_user(self.user)
        for photo_line in cart:
            order = orders.get(photo_line__id=photo_line['id'])
            order_items = [
                OrderItem(
                    photo_type=photo['photo_type'],
                    amount=photo['quantity'],
                    order=order,
                    photo=get_object_or_404(Photo, id=photo['id']),
                ) for photo in photo_line['photos']
            ]
            OrderItem.objects.bulk_create(order_items)
