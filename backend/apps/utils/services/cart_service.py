import loguru
from decimal import Decimal
from django.conf import settings

# from apps.photo.models.photo import Photo


class CartService:
    """Сервис корзины товаров."""
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    # Общие методы

    def save(self):
        """Сохранение состояния корзины в сессии."""
        self.session[settings.CART_SESSION_ID] = self.cart
        self.session.modified = True

    def __len__(self):
        """Количество корзин."""
        return len(self.cart.keys())

    def clear(self):
        """Полная очистка сессии."""
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True

    # Методы для корзины в целом

    def check_cart_exists(self, user):
        """Проверить наличие корзины пользователя в сессии."""
        user_id = str(user.id)
        if user_id in self.cart:
            return True
        return False

    def create_cart(self, user):
        """Cоздать корзину."""
        user_id = str(user.id)
        self.cart[user_id] = []
        self.save()

    def remove_cart(self, user):
        """Удалить корзину из сессии."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            del self.cart[user_id]
            self.save()

    def get_cart_length(self, user):
        """Получить количество позиций в корзине."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            return len(self.cart[user_id])

    def get_photo_ids(self, user):
        """Получить все id фотографий"""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            photo_ids = []
            for position in self.cart[user_id]:
                photo_ids.append(position['photo_id'])
            return photo_ids

    def get_kindergarten_ids(self, user):
        """Получить все id детских садов, имеющихся в корзине."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            kindergarten_ids = []
            for position in self.cart[user_id]:
                kindergarten_ids.append(position['kindergarten_id'])
            return kindergarten_ids

    def get_cart_list(self, user):
        """Получить все позиции корзины в list."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            return self.cart[user_id]
        return []

    def get_total_price(self, user):
        """Получить итоговую стоимость всех позиций корзины"""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            total_prices = {}

            for position in self.cart[user_id]:
                total_price = Decimal(0)
                total_price += (Decimal(position['quantity']) * Decimal(position['price_per_piece']))
                kindergarten_id = position['kindergarten_id']
                if kindergarten_id not in total_prices.keys():
                    total_prices[kindergarten_id] = total_price
                else:
                    total_prices[kindergarten_id] += total_price
            return total_prices

    # Методы для позиций корзины

    def add_product_to_cart(self, user, product_data):
        """Добавить товар в корзину."""
        if not self.check_cart_exists(user):
            self.create_cart(user=user)

        user_id = str(user.id)
        self.cart[user_id].append(product_data)
        self.save()

    def add_product_list_to_cart(self, user, product_list):
        if not self.check_cart_exists(user):
            self.create_cart(user=user)

        user_id =str(user.id)
        self.cart[user_id] = product_list
        self.save()

    def get_photo_index_in_cart(self, user, product_id, photo_type):
        """Получить индекс товара в корзине."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            index = 0
            for product in self.cart[user_id]:
                if product['photo_id'] == product_id and product['photo_type'] == photo_type:
                    return index
                index += 1

    def remove_product_from_cart(self, user, product_id, photo_type):
        """Удалить товар из корзины."""
        if self.check_cart_exists(user):
            index = self.get_photo_index_in_cart(user, product_id, photo_type)
            if index is not None:
                user_id = str(user.id)
                self.cart[user_id].pop(index)
                self.save()