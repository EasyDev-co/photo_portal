from decimal import Decimal

from django.shortcuts import get_object_or_404

from apps.utils.services import CartService

from apps.order.models import Order, OrderItem
from apps.kindergarten.models import Kindergarten, PhotoPrice, PhotoType
from apps.photo.models import Photo

from apps.promocode.models.bonus_coupon import BonusCoupon


class OrderService:
    """Сервис создания заказов из корзины."""
    def __init__(self, request, cart: CartService, kindergartens=None):
        self.request = request
        self.cart = cart
        self.kindergartens = kindergartens

    def prepare_the_order_data(self):
        """Подготовка данных из корзины для создания заказа."""
        user = self.request.user
        kindergartens_ids = self.cart.get_kindergarten_ids(user)
        photo_ids = self.cart.get_photo_ids(user)

        kindergartens = Kindergarten.objects.filter(id__in=kindergartens_ids)
        self.kindergartens = kindergartens
        photos = Photo.objects.filter(id__in=photo_ids)
        bonus_coupon = BonusCoupon.objects.filter(user=user, is_active=True, balance__gt=0).first()
        promocode = user.promocode
        return photos, bonus_coupon, promocode

    def _user_did_order_digital(self):
        """Проверка, заказал ли пользователь электронные фото?"""
        if not self.request.data['is_digital']:
            return False
        return True

    def _get_is_digital_and_digital_cost(self, user_did_order_digital, total_prices_no_discount):
        """Проверка, будут ли электронные фото в заказе и добавление их стоимости."""
        digital_data = {}
        if not user_did_order_digital:
            for kindergarten in self.kindergartens:
                ransom_amount = kindergarten.region.ransom_amount
                exceeding_ransom_amount = total_prices_no_discount[str(kindergarten.id)] >= Decimal(ransom_amount)
                digital_data.update(
                    {
                        str(kindergarten.id): {
                            'is_digital': exceeding_ransom_amount,
                            'digital_cost': Decimal(0),
                        }
                    }
                )
        else:
            for kindergarten in self.kindergartens:
                ransom_amount = kindergarten.region.ransom_amount
                exceeding_ransom_amount = total_prices_no_discount[str(kindergarten.id)] >= Decimal(ransom_amount)
                if exceeding_ransom_amount:
                    digital_data.update(
                        {
                            str(kindergarten.id): {
                                'is_digital': True,
                                'digital_cost': Decimal(0),
                            }
                        }
                    )
                else:
                    photo_price = get_object_or_404(
                        PhotoPrice,
                        photo_type=PhotoType.digital,
                        region=kindergarten.region
                    )
                    digital_data.update(
                        {
                            str(kindergarten.id): {
                                'is_digital': True,
                                'digital_cost': Decimal(photo_price.price),
                            }
                        }
                    )
        return digital_data

    def get_digital_data(self):
        """Проверка наличия в заказе электронных фото и расчет их стоимости."""
        total_prices_no_discount = self.cart.get_total_price(user=self.request.user)
        user_did_order_digital = self._user_did_order_digital()
        digital_data = self._get_is_digital_and_digital_cost(
            user_did_order_digital,
            total_prices_no_discount,
        )
        return digital_data

    def create_orders(self):
        """Создать объекты заказов исходя из данных корзины и данных об электронных фото."""
        digital_data = self.get_digital_data()
        orders = [
            Order(
                user=self.request.user,
                kindergarten=kindergarten,
                is_digital=digital_data[str(kindergarten.id)]['is_digital'],
                order_price=digital_data[str(kindergarten.id)]['digital_cost'],
            ) for kindergarten in self.kindergartens
        ]
        orders = Order.objects.bulk_create(orders)

        order_ids = []
        for order in orders:
            order_ids.append(order.id)
        orders = Order.objects.filter(id__in=order_ids)
        return orders

    def create_order_items(self, orders, photos, bonus_coupon, promocode):
        total_prices_with_discount = {}
        cart_list = self.cart.get_cart_list(self.request.user)
        order_items = []
        for position in cart_list:
            order = orders.get(kindergarten__id=position['kindergarten_id'])
            photo = photos.get(id=position['photo_id'])
            price = Decimal(position['price_per_piece'] * position['quantity'])
            if bonus_coupon:
                price = bonus_coupon.use_bonus_coupon_to_price(price)
            if promocode:
                price = promocode.use_promocode_to_price(price, photo_type=position['photo_type'])
            if not str(order.id) in total_prices_with_discount.keys():
                total_prices_with_discount[str(order.id)] = price
            else:
                total_prices_with_discount[str(order.id)] += price
            order_items.append(
                OrderItem(
                    photo_type=position['photo_type'],
                    amount=position['quantity'],
                    order=order,
                    photo=photo,
                )
            )
        for order in orders:
            order.order_price += total_prices_with_discount[str(order.id)]
            order.save()

        OrderItem.objects.bulk_create(order_items)
