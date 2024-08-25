from datetime import datetime

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
    Сериализатор для получения пробников.
    """
    deadline = serializers.SerializerMethodField()
    photos = PhotoRetrieveSerializer(many=True, read_only=True)

    ransom_amount = serializers.SerializerMethodField()

    class Meta:
        model = PhotoLine
        fields = ('id', 'photos', 'parent', 'deadline', 'ransom_amount')

    def get_deadline(self, obj):
        return obj.photo_theme.date_end

    def get_ransom_amount(self, obj):
        return obj.kindergarten.region.ransom_amount


class CurrentPhotoThemeRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения темы фотосессии.
    """

    class Meta:
        model = PhotoTheme
        fields = ('name', 'date_start', 'date_end')


class PaidPhotoLineSerializer(serializers.ModelSerializer):
    photo_theme_name = serializers.SerializerMethodField()
    photo_theme_date = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    photos = PhotoRetrieveSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoLine
        fields = ('photos', 'region', 'photo_theme_name', 'photo_theme_date')

    def get_photo_theme_name(self, obj):
        return obj.photo_theme.name

    def get_photo_theme_date(self, obj):
        return format(datetime.date(obj.photo_theme.date_start), '%B %Y')

    def get_region(self, obj):
        return obj.kindergarten.region.name
