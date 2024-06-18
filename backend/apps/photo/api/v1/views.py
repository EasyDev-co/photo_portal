from rest_framework.generics import RetrieveAPIView

from apps.photo.api.v1.serializers import (CurrentPhotoThemeRetrieveSerializer,
                                           PhotoLineRetrieveSerializer,
                                           PhotoRetrieveSerializer)
from apps.photo.models import Photo, PhotoLine, PhotoTheme


class PhotoRetrieveAPIView(RetrieveAPIView):
    """
    Получение фотографии по введенному номеру.
    """
    serializer_class = PhotoRetrieveSerializer
    lookup_field = 'number'

    def get_queryset(self):
        number = self.kwargs['number']
        return Photo.objects.filter(number=number)


class PhotoLineRetrieveAPIView(RetrieveAPIView):
    """
    Получение линии фотографий.
    """
    serializer_class = PhotoLineRetrieveSerializer
    queryset = PhotoLine.objects.prefetch_related('photos').all()


class CurrentPhotoThemeRetrieveAPIView(RetrieveAPIView):
    """
    Получение информации об актуальной теме фотосессии.
    """
    queryset = PhotoTheme.objects.filter(is_active=True)
    serializer_class = CurrentPhotoThemeRetrieveSerializer
