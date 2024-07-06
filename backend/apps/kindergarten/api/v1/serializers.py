from rest_framework import serializers

from apps.kindergarten.models import PhotoPrice


class PhotoPriceSerializer(serializers.ModelSerializer):
    """Сериализатор для получения цен на фото."""

    class Meta:
        model = PhotoPrice
        fields = '__all__'
