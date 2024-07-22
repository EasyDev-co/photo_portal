from decimal import Decimal, ROUND_HALF_UP

from django.shortcuts import get_object_or_404

from apps.kindergarten.models import PhotoPrice, PhotoType
from apps.photo.models import PhotoLine
from apps.promocode.models.bonus_coupon import BonusCoupon


class PhotoLineCartService:
    """Сервис для подготовки фотолиний к добавлению в корзину."""

    def __init__(self, user, serializer):
        self.user = user
        self.serializer = serializer
        self.promocode = None
        self.bonus_coupon = None

    def check_discount(self):
        """Проверить наличие промокода и бонусного купона"""
        self.promocode = self.user.promocode
        self.bonus_coupon = BonusCoupon.objects.filter(user=self.user, is_active=True, balance__gt=0).first()

    def apply_promocode(self, photo):
        """Применить к ценам фото промокоды."""
        photo_type = photo['photo_type']
        if self.promocode:
            photo['discount_price'] = self.promocode.use_promocode_to_price(
                Decimal(photo['price_per_piece']).quantize(Decimal("0.0"), rounding=ROUND_HALF_UP), photo_type)
        else:
            photo['discount_price'] = Decimal(photo['price_per_piece']).quantize(Decimal("0.0"), rounding=ROUND_HALF_UP)
        price = Decimal(photo['discount_price']).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP) * photo['quantity']
        return price

    def apply_bonus_coupon(self, total_price):
        """Применить к итоговой цене фотолинии бонусный купон."""
        if self.bonus_coupon:
            total_price = self.bonus_coupon.use_bonus_coupon_to_price(total_price)
        return total_price

    @staticmethod
    def check_ransom(photo_line, total_price):
        """Проверить, превышает ли сумма заказа сумму выкупа."""
        photo_line_obj = get_object_or_404(PhotoLine, id=photo_line['id'])
        ransom_amount = photo_line_obj.kindergarten.region.ransom_amount
        return total_price >= ransom_amount

    def add_digital_photos_cost(self, photo_line, total_price):
        """Добавить к стоимости заказа стоимость электронных фото."""
        region = get_object_or_404(PhotoLine, id=photo_line['id']).kindergarten.region
        digital_price = get_object_or_404(PhotoPrice, region=region, photo_type=PhotoType.digital).price
        if self.promocode:
            digital_price = self.promocode.use_promocode_to_price(Decimal(digital_price), photo_type=PhotoType.digital)
        total_price += Decimal(digital_price)
        return total_price

    def add_photobook_cost(self, photo_line, total_price):
        region = get_object_or_404(PhotoLine, id=photo_line['id']).kindergarten.region
        photobook_price = get_object_or_404(PhotoPrice, region=region, photo_type=PhotoType.photobook).price
        if self.promocode:
            photobook_price = self.promocode.use_promocode_to_price(Decimal(photobook_price), photo_type=PhotoType.photobook)
        total_price += Decimal(photobook_price)
        return total_price

    def calculate_the_cost(self):
        """Посчитать стоимость фотолинии"""
        self.check_discount()
        for photo_line in self.serializer.data:
            photos = photo_line['photos']
            total_price = Decimal(0)

            for photo in photos:
                price = self.apply_promocode(photo)
                total_price += price

            if photo_line['is_photobook']:
                total_price = self.add_photobook_cost(photo_line, total_price)

            is_more_ransom_amount = self.check_ransom(photo_line, total_price)

            if is_more_ransom_amount:
                photo_line.update({'is_digital': True})

            if not is_more_ransom_amount and photo_line['is_digital']:
                total_price = self.add_digital_photos_cost(photo_line, total_price)

            total_price = self.apply_bonus_coupon(total_price)
            photo_line.update(
                {
                    'is_more_ransom_amount': is_more_ransom_amount,
                    'total_price': str(total_price),
                }
            )
