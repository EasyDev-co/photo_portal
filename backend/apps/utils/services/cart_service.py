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

    def add(self, photo, price, is_digital=False, photo_type=None, quatity=1, update_quantity=False):
        """Добавить фото в корзину."""
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

    def save(self):
        """Обновление сессии cart."""
        self.session[settings.CART_SESSION_ID] = self.cart
        self.session.modified = True

    def remove(self, photo):
        """Удаление фото из корзины."""
        photo_id = str(photo.id)
        if photo_id in self.cart:
            del self.cart[photo_id]
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
