from rest_framework import serializers
from apps.cart.models import Cart, PhotoInCart
from apps.photo.models import PhotoLine
from apps.cart.api.v1.serializer import PhotoInCartSerializer
from apps.photo.models import Photo


class PhotoInCartV2Serializer(serializers.ModelSerializer):
    """Сериализатор для Фото в корзине."""
    id = serializers.PrimaryKeyRelatedField(source='photo', queryset=Photo.objects.all())
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = PhotoInCart
        fields = (
            'id',
            'photo_type',
            'quantity',
            'price_per_piece',
            'discount_price',
        )


class CartPhotoLineCreateUpdateV2Serializer(serializers.Serializer):
    """
    Сериализатор для создания/обновления позиции корзины.
    Вся бизнес-логика создания позиции вынесена в CartService.
    """
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    id = serializers.PrimaryKeyRelatedField(
        source='photo_line',
        queryset=PhotoLine.objects.all()
    )
    photos = PhotoInCartV2Serializer(many=True)
    is_digital = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    is_free_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    promo_code = serializers.CharField(required=False, allow_blank=True)
    child_number = serializers.IntegerField(required=False)


class CartPhotoLineV2Serializer(serializers.Serializer):
    id = serializers.UUIDField()
    photos = serializers.SerializerMethodField()
    photo_line_id = serializers.UUIDField(required=False, allow_null=True)
    is_digital = serializers.BooleanField(default=False)
    is_photobook = serializers.BooleanField(default=False)
    is_free_calendar = serializers.BooleanField(default=False)
    is_free_digital = serializers.BooleanField(default=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    child_number = serializers.IntegerField(required=False, allow_null=True)
    all_price = serializers.IntegerField(required=False, allow_null=True)
    cart_error = serializers.CharField(required=False, allow_blank=True, allow_null=True)


    @staticmethod
    def get_photos(obj):
        photos_in_cart = PhotoInCart.objects.filter(cart_photo_line=obj)
        serializer = PhotoInCartSerializer(photos_in_cart, many=True)
        return serializer.data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        photo_line_id = str(instance.photo_line_id) if instance.photo_line_id else None
        representation['photo_line_id'] = photo_line_id

        cart_error = self.context.get('cart_error')
        representation['cart_error'] = cart_error
        return representation
