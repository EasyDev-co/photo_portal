from rest_framework import serializers

from apps.photo.models import Photo, PhotoLine, PhotoTheme


class PhotoRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения фотографии.
    """

    class Meta:
        model = Photo
        fields = ('number', 'photo')


class PhotoLineRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения линии фотографий.
    """
    photos = PhotoRetrieveSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoLine
        fields = ('photos',)


class CurrentPhotoThemeRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения темы фотосессии.
    """

    class Meta:
        model = PhotoTheme
        fields = ('name', 'date_start', 'date_end')
