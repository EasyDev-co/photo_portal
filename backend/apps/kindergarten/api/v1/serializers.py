from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice, Kindergarten, Region


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
        fields = ('region', 'name')


class PhotoPriceSerializer(serializers.ModelSerializer):
    """Сериализатор для получения цен на фото."""

    class Meta:
        model = PhotoPrice
        fields = '__all__'


class PhotoPriceByRegionSerializer(serializers.Serializer):
    region = serializers.CharField(max_length=200)
