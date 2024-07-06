from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice


class PhotoPriceSerializer(serializers.ModelSerializer):
    """Сериализатор для получения цен на фото."""

    class Meta:
        model = PhotoPrice
        fields = '__all__'


class PhotoPriceByRegionSerializer(serializers.Serializer):
    region = serializers.CharField(max_length=200)
