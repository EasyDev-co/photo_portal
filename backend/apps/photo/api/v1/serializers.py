from datetime import datetime

from rest_framework import serializers

from apps.photo.models import Photo, PhotoLine, PhotoTheme


class PhotoRetrieveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения фотографии.
    """

    class Meta:
        model = Photo
        fields = ('id', 'number', 'photo_file', 'watermarked_photo')


class PhotoThemeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения темы фотосессии.
    """

    class Meta:
        model = PhotoTheme
        fields = ('id', 'name', 'date_start', 'date_end')


class PhotoLineSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения пробников.
    """
    deadline = serializers.SerializerMethodField()
    photos = PhotoRetrieveSerializer(many=True, read_only=True)
    ransom_amount_for_digital_photos = serializers.SerializerMethodField()
    ransom_amount_for_calendar = serializers.SerializerMethodField()
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
            'photo_theme'
        )

    def get_deadline(self, obj):
        return obj.photo_theme.date_end

    def get_ransom_amount_for_digital_photos(self, obj):
        return obj.kindergarten.region.ransom_amount_for_digital_photos

    def get_ransom_amount_for_calendar(self, obj):
        return obj.kindergarten.region.ransom_amount_for_calendar


class PaidPhotoLineSerializer(serializers.ModelSerializer):
    photo_theme_name = serializers.SerializerMethodField()
    photo_theme_date = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()

    class Meta:
        model = PhotoLine
        fields = ('id', 'photos', 'region', 'photo_theme_name', 'photo_theme_date')

    def get_photo_theme_name(self, obj):
        return obj.photo_theme.name

    def get_photo_theme_date(self, obj):
        return format(datetime.date(obj.photo_theme.date_start), '%B %Y')

    def get_region(self, obj):
        return obj.kindergarten.region.name

    def get_photos(self, obj):
        if obj.is_digital:
            return PhotoRetrieveSerializer(obj.photos.all(), many=True).data
        return []
