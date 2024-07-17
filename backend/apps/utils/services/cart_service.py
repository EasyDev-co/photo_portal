from django.conf import settings


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

    def add_products_to_cart(self, user, product_list):
        """Добавить в корзину фотолинию."""
        if self.check_cart_exists(user):
            self.remove_cart(user=user)
        self.create_cart(user)
        user_id = str(user.id)
        self.cart[user_id] = product_list
        self.save()

    def get_cart_list(self, user):
        """Получить все позиции корзины в list."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            return self.cart[user_id]
        return []

    def gef_cart_by_user_id(self, user):
        if self.check_cart_exists(user):
            user_id = str(user.id)
            return self.cart[user_id]
        return {}
