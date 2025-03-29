from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice, Kindergarten, Region, Ransom
from apps.photo.models import PhotoTheme

from apps.photo.api.v1.serializers import PhotoThemeSerializer


class RegionSerializer(serializers.ModelSerializer):
    """Сериализатор для получения информации о регионе у пользователя."""

    class Meta:
        model = Region
        fields = ('id', 'country', 'name')




class PhotoThemeForKindergartenSerializer(serializers.ModelSerializer):

    class Meta:
        model = PhotoTheme
        fields = ('id', 'name', 'date_start', 'date_end')

class KindergartenSerializer(serializers.ModelSerializer):
    """Сериализатор для получения информации о детском саде у пользователя."""
    region = RegionSerializer(read_only=True)
    active_photo_theme = serializers.SerializerMethodField()

    class Meta:
        model = Kindergarten
        fields = ('id', 'region', 'name', 'has_photobook', 'active_photo_theme')

    def get_active_photo_theme(self, obj):
        """Получение активной фотосессии, связанной с конкретным детским садом."""
        active_photo_theme = obj.kindergartenphototheme.filter(is_active=True).select_related('photo_theme').first()
        return PhotoThemeForKindergartenSerializer(active_photo_theme.photo_theme).data if active_photo_theme else None


class PhotoPriceSerializer(serializers.ModelSerializer):
    """Сериализатор для получения цен на фото."""

    class Meta:
        model = PhotoPrice
        fields = '__all__'


class PhotoPriceByRegionSerializer(serializers.Serializer):
    region = serializers.CharField(max_length=200)


class KindergartenStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики по детскому саду."""

    total_orders = serializers.IntegerField() # На самом деле тут лежат не заказы, а кол-во детей участвует в фотосессии
    completed_orders = serializers.IntegerField()
    average_order_value = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    total_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )


class RansomSerializer(serializers.ModelSerializer):
    """
    Сериализатор для выкупа по детскому саду.
    """
    kindergarten = KindergartenSerializer()
    photo_theme = PhotoThemeSerializer()

    class Meta:
        model = Ransom
        fields = (
            'kindergarten',
            'photo_theme',
            'ransom_amount'
        )
