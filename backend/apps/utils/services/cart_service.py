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

    # Методы для позиций корзины

    def sort_products_in_cart(self, user):
        if self.check_cart_exists(user):
            user_id = str(user.id)
            self.cart[user_id] = sorted(self.cart[user_id], key=lambda p: p['photo_id'])
            self.save()

    def add_product_to_cart(self, user, product_data):
        """Добавить товар в корзину."""
        if not self.check_cart_exists(user):
            self.create_cart(user=user)

        user_id = str(user.id)
        self.cart[user_id].append(product_data)
        self.sort_products_in_cart(user)
        self.save()

    def find_product_by_id(self, user, product_id):
        """Найти товар в корзине пользователя по id товара."""
        if self.check_cart_exists(user):
            self.sort_products_in_cart(user)
            user_id = str(user.id)

            start_index, end_index = 0, len(self.cart[user_id]) - 1
            while start_index <= end_index:
                mid = (start_index + end_index) // 2
                mid_value = self.cart[user_id][mid]['photo_id']

                if mid_value == product_id:
                    return self.cart[user_id][mid]
                if mid_value < product_id:
                    start_index = mid + 1
                else:
                    end_index = mid - 1
            return self.cart[user_id]

    def find_product_index_by_id(self, user, product_id):
        """Найти индекс товара в списке (корзине) по id товара."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            start_index, end_index = 0, len(self.cart[user_id]) - 1
            while start_index <= end_index:
                mid = (start_index + end_index) // 2
                mid_value = self.cart[user_id][mid]['photo_id']

                if mid_value == product_id:
                    return mid
                if mid_value < product_id:
                    start_index = mid + 1
                else:
                    end_index = mid - 1

    def remove_product_from_cart(self, user, product_id, photo_type):
        """Временный метод удаления товара из корзины."""
        user_id = str(user.id)
        cart_dict = self.cart[user_id].copy()
        for index, product in cart_dict.items():
            if product_id == product['photo_id'] and photo_type == product['photo_type']:
                del self.cart[user_id][index]
        self.save()

    def is_photo_in_cart(self, user, photo, photo_type):
        """Проверить наличие фотографии в корзине пользователя указанного типа."""
        if self.check_cart_exists(user):
            user_id = str(user.id)
            photo_id = str(photo.id)
            if photo_id in self.cart[user_id] and photo_type in self.cart[user_id][photo_id]:
                return True
        return False





    def add(self, user, photo, price, is_digital=False, photo_type=None, quatity=1, update_quantity=False):
        """Добавить фото в корзину."""
        user_id = str(user.id)

        if user_id not in self.cart:
            self.cart[user_id] = {}

        photo_id = str(photo.id)


        if photo_id not in self.cart:
            self.cart[photo_id] = {
                'quantity': 0,
                'photo_type': photo_type,
                'is_digital': is_digital,
                'total_price': price,
            }

        if update_quantity:
            self.cart[photo_id]['quantity'] = quatity
        else:
            self.cart[photo_id]['quantity'] += quatity
        self.save()

    # def __iter__(self):
    #     """Перебор элементов в корзине."""
    #     photo_ids = self.cart.keys()
    #     photos = Photo.objects.filter(id__in=photo_ids)
    #
    #     for photo in photos:
    #         self.cart[str(photo.id)]['photo'] = photo
    #
    #     for item in self.cart.values():
    #         yield item

    def __len__(self):
        """Количество уникальных фотографий."""
        return len(self.cart.keys())

    def clear(self):
        """Очистка корзины."""
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
