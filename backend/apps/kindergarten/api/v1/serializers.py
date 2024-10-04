from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice, Kindergarten, Region, Ransom
from apps.photo.api.v1.serializers import PhotoThemeSerializer


class RegionSerializer(serializers.ModelSerializer):
    """Сериализатор для получения информации о регионе у пользователя."""

    class Meta:
        model = Region
        fields = ('country', 'name')


class KindergartenSerializer(serializers.ModelSerializer):
    """Сериализатор для получения информации о детском саде у пользователя."""
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Kindergarten
        fields = ('id', 'region', 'name')


class PhotoPriceSerializer(serializers.ModelSerializer):
    """Сериализатор для получения цен на фото."""

    class Meta:
        model = PhotoPrice
        fields = '__all__'


class PhotoPriceByRegionSerializer(serializers.Serializer):
    region = serializers.CharField(max_length=200)


class KindergartenStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики по детскому саду."""

    total_orders = serializers.IntegerField()
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
