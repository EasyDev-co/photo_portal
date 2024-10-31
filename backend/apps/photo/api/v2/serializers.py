from rest_framework import serializers
from apps.photo.models.photo_line import PhotoTheme
from apps.kindergarten.models.kindergarten import Kindergarten


class PhotoUploadSerializer(serializers.Serializer):
    kindergarten_id = serializers.PrimaryKeyRelatedField(
        queryset=Kindergarten.objects.all(),
        source='kindergarten',
        write_only=True
    )
    photo_theme = serializers.PrimaryKeyRelatedField(
        queryset=PhotoTheme.objects.all()
    )
    photos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True
    )


class PhotoThemeSerializerV2(serializers.ModelSerializer):
    class Meta:
        model = PhotoTheme
        fields = '__all__'
