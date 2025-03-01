from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

from apps.cart.models import Cart, CartPhotoLine, PhotoInCart
from apps.cart.api.v2.serializers import CartPhotoLineCreateUpdateV2Serializer, CartPhotoLineV2Serializer
from apps.user.models import UserRole
from apps.kindergarten.models import Kindergarten, PhotoPrice, PhotoType
from apps.photo.models import KindergartenPhotoTheme, PhotoTheme, Photo

from loguru import logger


class CartV2APIView(APIView):
    """
    Представление для работы с корзиной:
      - GET: возвращает позиции корзины текущего пользователя;
      - POST: обновляет корзину на основе переданных данных.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_photo_lines = CartPhotoLine.objects.filter(cart=cart)
        serializer = CartPhotoLineV2Serializer(cart_photo_lines, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        logger.info(f"data: {request.data}")

        user = request.user
        user_role = request.user.role

        kindergarten_id = request.data.get("kindergarten_id")
        photo_theme_id = request.data.get("photo_theme_id")

        kindergarten, photo_theme = self._validate_kindergarten_and_photo_theme(
            kindergarten_id,
            photo_theme_id,
            user,
            user_role,
        )

        if not kindergarten or not photo_theme:
            return Response(
                {"message": "Регион или детский сад не валидны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart = self._get_or_create_cart(user)
        ransom_amounts = self._get_ransom_amount(kindergarten)
        prices = self._get_prices(kindergarten)

        if not ransom_amounts:
            return Response({"message": "Суммы выкупа не заданы"})

    @staticmethod
    def _get_or_create_cart(user):
        cart = Cart.objects.filter(user=user).first()
        if not cart:
            cart = Cart.objects.create(user=user)
        return cart

    @staticmethod
    def _update_photos_in_cart(cart_photo_line, photos_data, prices):
        for photo_info in photos_data:
            photo_uuid = photo_info.get("id")
            photo_type_int = photo_info.get("photo_type")
            quantity = photo_info.get("quantity", 0)

            if not photo_uuid or photo_type_int is None:
                continue

            try:
                photo_obj = Photo.objects.get(id=photo_uuid)
            except Photo.DoesNotExist:
                logger.info(f"error: photo not found: {photo_uuid}")
                continue

            try:
                photo_type_label = PhotoType(photo_type_int).label
            except ValueError:
                logger.info(f"error: photo type: {photo_type_int}")
                continue

            price_per_piece = prices.get(photo_type_label)

            if not price_per_piece:
                continue

            if quantity > 0:
                pic, created = PhotoInCart.objects.get_or_create(
                    cart_photo_line=cart_photo_line,
                    photo=photo_obj,
                    photo_type=photo_type_int,
                    defaults={
                        'quantity': quantity,
                        'price_per_piece': price_per_piece
                    }
                )
                if not created:
                    pic.quantity = quantity
                    pic.price_per_piece = price_per_piece
                    pic.save()
            else:
                PhotoInCart.objects.filter(
                    cart_photo_line=cart_photo_line,
                    photo=photo_obj,
                    photo_type=photo_type_int
                ).delete()

    @staticmethod
    def _get_prices(kindergarten):
        prices_by_type = {}
        region = kindergarten.region

        if not region:
            return prices_by_type
        for photo_type_value, photo_type_label in PhotoType.choices:
            price_instance = region.photo_prices.filter(photo_type=photo_type_value).first()
            prices_by_type[photo_type_label] = price_instance.price if price_instance else None
        return prices_by_type


    @staticmethod
    def _get_ransom_amount(kindergarten):
        region = kindergarten.region
        if not region:
            return {}

        prices = {}

        if region.ransom_amount_for_digital_photos is not None:
            prices['ransom_amount_for_digital_photos'] = region.ransom_amount_for_digital_photos

        if region.ransom_amount_for_calendar is not None:
            prices['ransom_amount_for_calendar'] = region.ransom_amount_for_calendar

        if region.ransom_amount_for_digital_photos_second is not None:
            prices['ransom_amount_for_digital_photos_second'] = region.ransom_amount_for_digital_photos_second

        if region.ransom_amount_for_calendar_second is not None:
            prices['ransom_amount_for_calendar_second'] = region.ransom_amount_for_calendar_second

        if region.ransom_amount_for_digital_photos_third is not None:
            prices['ransom_amount_for_digital_photos_third'] = region.ransom_amount_for_digital_photos_third

        if region.ransom_amount_for_calendar_third is not None:
            prices['ransom_amount_for_calendar_third'] = region.ransom_amount_for_calendar_third

        return prices


    @staticmethod
    def _validate_kindergarten_and_photo_theme(kindergarten_id, photo_theme_id, user, user_role):
        kindergarten = Kindergarten.objects.filter(id=kindergarten_id)

        if not kindergarten:
            return Response(
                {"message": "Нет детского сада"},
            status=status.HTTP_400_BAD_REQUEST
            )

        photo_theme = PhotoTheme.objects.filter(id=photo_theme_id)
        if not photo_theme:
            return None


        if user_role == UserRole.manager:
            user_kindergarten = user.kindergarten.filter(id=kindergarten_id).exists()
        elif user_role == UserRole.manager:
            user_kindergarten = user.managed_kindergarten.filter(id=kindergarten_id).exists()
        else:
            user_kindergarten = False

        if not user_kindergarten:
            return None

        if not user.kindergarten.filter(id=kindergarten_id).exists():
            return None

        if not KindergartenPhotoTheme.objects.filter(
                kindergarten=kindergarten,
                photo_theme_id=photo_theme_id,
                is_active=True
        ).exists():
            return None

        return kindergarten, photo_theme
