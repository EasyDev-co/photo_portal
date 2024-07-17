from django.shortcuts import get_object_or_404

from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.photo.api.v1.serializers import (CurrentPhotoThemeRetrieveSerializer,
                                           PhotoLineSerializer,
                                           PhotoRetrieveSerializer)
from apps.photo.models import Photo, PhotoLine, PhotoTheme
from apps.photo.permissions import HasPermissionCanViewPhotoLine


class PhotoRetieveByIdAPIView(RetrieveAPIView):
    """
    Получение фотографии по id
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoRetrieveSerializer
    permission_classes = [IsAuthenticated]


class PhotoRetrieveAPIView(RetrieveAPIView):
    """
    Получение фотографии по введенному номеру.
    """
    serializer_class = PhotoRetrieveSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'number'

    def get_queryset(self):
        number = self.kwargs['number']
        return Photo.objects.filter(number=number)


class PhotoLineGetByPhotoNumberAPIView(APIView):
    """Представление для получения фотолинии по номерам фото."""
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]

    @staticmethod
    def get(request):
        """Получение фотолинии по id"""
        photo_numbers = request.data['numbers']
        first_photo = get_object_or_404(Photo, number=photo_numbers[0])
        photo_line = first_photo.photo_line
        photo_line_photos = photo_line.photos.select_related('photos')
        numbers_in_photo_line = list(photo_line_photos.values_list('number', flat=True))
        if photo_numbers == numbers_in_photo_line:
            serializer = PhotoLineSerializer(photo_line)
            return Response(serializer.data)
        return Response({'message': 'Фотолиния с указанными фотографиями не найдена'})


class PhotoLineGetUpdateParentAPIView(RetrieveUpdateAPIView):
    """Представление для получения одной фотолинии или указания родителя в фотолинии."""
    serializer_class = PhotoLineSerializer
    queryset = PhotoLine.objects.all()
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]


class PhotoLinesGetByParent(ListAPIView):
    """Представление для получения всех фотолиний родителя"""
    serializer_class = PhotoLineSerializer
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]
    lookup_field = 'parent'

    def get_queryset(self):
        parent = self.request.user
        return PhotoLine.objects.filter(parent=parent, photo_theme__is_active=True)


class PhotoLineRetrieveAPIView(RetrieveAPIView):
    """
    Получение линии фотографий.
    """
    serializer_class = PhotoLineSerializer
    queryset = PhotoLine.objects.prefetch_related('photos').all()
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]


class CurrentPhotoThemeRetrieveAPIView(RetrieveAPIView):
    """
    Получение информации об актуальной теме фотосессии.
    """
    queryset = PhotoTheme.objects.filter(is_active=True)
    serializer_class = CurrentPhotoThemeRetrieveSerializer
