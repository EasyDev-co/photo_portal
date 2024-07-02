import loguru
from pprint import pformat

from django.shortcuts import get_object_or_404, get_list_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.order.models import Order, OrderItem
from apps.order.models.const import PhotoType
from apps.photo.models import Photo

from apps.order.api.v1.serializers import PhotoCartSerializer, OrderSerializer

from apps.utils.services import CartService

# Order
# order_price
# user - fk V
# kindergarten
# status

# OrderItem
# photo_type
# is_digital
# amount
# order - fk
# photo - fk


class OrderAPIView(APIView):
    """Представление для заказа."""

    def post(self, request):
        """Создание заказа из корзины."""
        cart = CartService(request)

        user = request.user
        # подумать, как достать kindergarten, чтобы все фото были из одного
        photos = get_list_or_404(Photo, id__in=cart.cart.keys())

        kindergarten = photos[0].photo_line.kindergarten

        order = Order.objects.create(
            user=user,
            kindergarten=kindergarten,
        )

        order_price = 0

        for photo in photos:
            photo_type = cart.cart[str(photo.id)]['photo_type']
            photo_price = photo.photo_line.kindergarten.region.photo_prices.select_related('region').get(photo_type=photo_type).price
            is_digital = cart.cart[str(photo.id)]['is_digital']
            amount = cart.cart[str(photo.id)]['quantity']

            order_price += (photo_price*amount)
            OrderItem.objects.create(
                photo_type=photo_type,
                is_digital=is_digital,
                amount=amount,
                order=order,
                photo=photo,
            )

        order.order_price = order_price
        order.save()
        cart.clear()
        return Response({'message': f'Заказ от {order.created} создан'})


class PhotoCartAPIView(APIView):
    """Представление для отображения корзины."""

    @swagger_auto_schema(responses={"200": openapi.Response(description="")},
                         request_body=PhotoCartSerializer)
    def post(self, request):
        """Добавление фото в корзину."""
        cart = CartService(request)
        user = request.user
        photo = get_object_or_404(Photo, id=request.data['photo_id'])

        if photo:
            region = photo.photo_line.kindergarten.region
            price_per_piece = region.photo_prices.select_related('region').get(photo_type=request.data['photo_type']).price
            photo_data = {
                'photo_id': str(photo.id),
                'photo_type': request.data['photo_type'],
                'is_digital': request.data['is_digital'],
                'quantity': request.data['quantity'],
                'price_per_piece': float(price_per_piece),
            }
            cart.add_product_to_cart(user, photo_data)
            return Response({'message': f'Фото {photo.id} успешно добавлено в корзину'})
        return Response({'message': f'Фото не найдено в БД'})

    def get(self, request):
        """Показать корзину."""
        cart = CartService(request)

        photo_ids = []
        user_id = str(request.user.id)

        target_id = "0e3050a6-dcb9-4abb-9606-e96bfcf57251"
        target_product_index = cart.find_product_index_by_id(request.user, target_id)
        loguru.logger.info(pformat(target_product_index))

        for position in cart.cart[user_id]:
            photo_ids.append(position['photo_id'])
        photos = Photo.objects.filter(id__in=photo_ids)
        serializer = PhotoCartSerializer(photos, many=True)

        return Response(serializer.data)

    def delete(self, request):
        cart = CartService(request)
        cart.remove_cart(request.user)
        # user = request.user
        # cart.remove_product_from_cart(
        #     user=user,
        #     product_id=request.data['photo_id'],
        #     photo_type=request.data['photo_type'],
        # )
        return Response({'message': 'Удалено'})
