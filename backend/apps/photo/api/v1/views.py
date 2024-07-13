import loguru
from django.shortcuts import get_object_or_404

from rest_framework.generics import RetrieveAPIView
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


class PhotoLineGetUpdateParentAPIView(APIView):
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]
    """Представление для полочения одной фотолинии или указания родителя в фотолинии."""
    @staticmethod
    def get(request, pk):
        """Получение фотолинии по id"""
        photo_line = get_object_or_404(PhotoLine, id=pk)
        serializer = PhotoLineSerializer(photo_line)
        return Response(serializer.data)

    @staticmethod
    def patch(request, pk):
        """Обновление родителя фотолинии (обновляется на request.user'a)."""
        photo_line = get_object_or_404(PhotoLine, id=pk)
        photo_line.parent = request.user
        photo_line.save()
        serializer = PhotoLineSerializer(photo_line)
        return Response(serializer.data)


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
