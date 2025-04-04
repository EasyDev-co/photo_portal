from rest_framework import serializers

from apps.kindergarten.models import Ransom
from apps.photo.models import Photo, PhotoLine, PhotoTheme
from apps.order.models import OrderItem
from apps.order.models.order import OrderStatus, Order
from apps.photo.models.const import MONTHS_RU


class WatermarkedPhotoSerializer(serializers.ModelSerializer):
    """Сериализатор для получения фотографии."""

    class Meta:
        model = Photo
        fields = ('id', 'number', 'watermarked_photo_path')


class PhotoRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения фотографии.
    """

    class Meta:
        model = Photo
        fields = ('id', 'number', 'photo_file', 'watermarked_photo', 'watermarked_photo_path', 'photo_path')


class OrderItemSerializer(serializers.ModelSerializer):
    photo_name = serializers.CharField(source='photo.name', read_only=True)
    photo_type = serializers.CharField(source='get_photo_type_display', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'photo_name', 'photo_type', 'amount', 'price')


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ('id', 'is_digital', 'is_free_calendar', 'is_photobook', 'order_items')

    def get_order_items(self, obj):
        items = obj.order_items.all()
        return OrderItemSerializer(items, many=True).data


class RansomSerializerForPhotoThem(serializers.ModelSerializer):
    class Meta:
        model = Ransom
        fields = ('id', 'ransom_amount')


class PhotoThemeSerializer(serializers.ModelSerializer):
    ransom = serializers.SerializerMethodField()

    class Meta:
        model = PhotoTheme
        fields = ('id', 'name', 'date_start', 'date_end', 'ransom')

    def get_ransom(self, obj):
        # Получаем детский сад из контекста
        kindergarten = self.context.get('kindergarten')

        # Находим единственный объект Ransom для детского сада и темы
        if kindergarten:
            ransom = Ransom.objects.filter(
                kindergarten=kindergarten,
                photo_theme=obj
            ).first()
            return RansomSerializerForPhotoThem(ransom).data if ransom else None
        return None


class PhotoLineSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения пробников.
    """
    deadline = serializers.SerializerMethodField()
    photos = WatermarkedPhotoSerializer(many=True, read_only=True)
    ransom_amount_for_digital_photos = serializers.SerializerMethodField()
    ransom_amount_for_calendar = serializers.SerializerMethodField()

    ransom_amount_for_digital_photos_second = serializers.SerializerMethodField()
    ransom_amount_for_calendar_second = serializers.SerializerMethodField()

    ransom_amount_for_digital_photos_third = serializers.SerializerMethodField()
    ransom_amount_for_calendar_third = serializers.SerializerMethodField()

    photo_theme = PhotoThemeSerializer(read_only=True, required=False)

    class Meta:
        model = PhotoLine
        fields = (
            'id',
            'photos',
            'parent',
            'deadline',
            'ransom_amount_for_digital_photos',
            'ransom_amount_for_calendar',
            'ransom_amount_for_digital_photos_second',
            'ransom_amount_for_calendar_second',
            'ransom_amount_for_digital_photos_third',
            'ransom_amount_for_calendar_third',
            'child_number',
            'photo_theme'
        )

    def get_deadline(self, obj):
        return obj.photo_theme.date_end

    def get_ransom_amount_for_digital_photos(self, obj):
        return obj.kindergarten.region.ransom_amount_for_digital_photos

    def get_ransom_amount_for_calendar(self, obj):
        return obj.kindergarten.region.ransom_amount_for_calendar

    def get_ransom_amount_for_digital_photos_second(self, obj):
        return obj.kindergarten.region.ransom_amount_for_digital_photos_second

    def get_ransom_amount_for_calendar_second(self, obj):
        return obj.kindergarten.region.ransom_amount_for_calendar_second

    def get_ransom_amount_for_digital_photos_third(self, obj):
        return obj.kindergarten.region.ransom_amount_for_digital_photos_third

    def get_ransom_amount_for_calendar_third(self, obj):
        return obj.kindergarten.region.ransom_amount_for_calendar_third


class PaidPhotoLineSerializer(serializers.ModelSerializer):
    photo_theme_name = serializers.SerializerMethodField()
    photo_theme_date = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()
    is_date_end = serializers.SerializerMethodField()
    is_digital = serializers.BooleanField()
    is_free_digital = serializers.BooleanField()

    class Meta:
        model = PhotoLine
        fields = (
            'id', 'photos', 'region', 'photo_theme_name',
            'photo_theme_date', 'orders', 'is_date_end',
            'is_digital', 'is_free_digital'
        )

    def get_photo_theme_name(self, obj):
        return obj.photo_theme.name

    def get_photo_theme_date(self, obj):
        date_start = obj.photo_theme.date_start
        month_english = date_start.strftime('%B')
        year = date_start.strftime('%Y')
        month_russian = MONTHS_RU.get(month_english, month_english)
        return f"{month_russian} {year}"

    def get_region(self, obj):
        return obj.kindergarten.region.name

    def get_photos(self, obj):
        if obj.is_date_end:
            return PhotoRetrieveSerializer(obj.photos.all(), many=True).data
        return []

    def get_is_date_end(self, obj):
        return getattr(obj, 'is_date_end', False)
