from rest_framework import serializers

from apps.photo.models import Photo, PhotoLine, PhotoTheme


class PhotoRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения фотографии.
    """

    class Meta:
        model = Photo
        fields = ('id', 'number', 'photo')


class PhotoLineSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения линии фотографий.
    """
    deadline = serializers.SerializerMethodField()
    photos = PhotoRetrieveSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoLine
        fields = ('id', 'photos', 'parent', 'deadline')

    def get_deadline(self, obj):
        return obj.photo_theme.date_end


class CurrentPhotoThemeRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения темы фотосессии.
    """

    class Meta:
        model = PhotoTheme
        fields = ('name', 'date_start', 'date_end')
