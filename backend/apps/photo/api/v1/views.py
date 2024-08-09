from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import (
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    ListAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.photo.api.v1.serializers import (
    CurrentPhotoThemeRetrieveSerializer,
    PhotoLineSerializer,
    PhotoRetrieveSerializer
)
from apps.photo.models import Photo, PhotoLine, PhotoTheme, UserPhotoCount
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
    """Получение фотолинии по номерам фото."""
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]

    @swagger_auto_schema(responses={"200": PhotoLineSerializer()}, )
    def post(self, request):
        """Получение фотолинии по id"""

        user = request.user
        photo_numbers = request.data['numbers']
        first_photo = get_object_or_404(Photo, number=photo_numbers[0])
        photo_line = first_photo.photo_line

        if photo_line.kindergarten not in user.kindergarten.all():
            return Response(
                {'message': 'Фотолиния не относится к вашему детскому саду'},
                status=status.HTTP_403_FORBIDDEN,
            )

        photo_line_photos = photo_line.photos.select_related('photos')
        numbers_in_photo_line = list(
            photo_line_photos.values_list('number', flat=True)
        )

        if photo_numbers == numbers_in_photo_line:
            serializer = PhotoLineSerializer(photo_line)

            user_photo_count, created = UserPhotoCount.objects.get_or_create(
                user=user,
                photo_theme=photo_line.photo_theme,
            )

            if user_photo_count.count == 0:
                return Response(
                    {'message': 'Вы достигли лимита'},
                    status=status.HTTP_403_FORBIDDEN,
                )

            user_photo_count.count -= 1
            user_photo_count.save()

            return Response(serializer.data)

        return Response(
            {'message': 'Фотолиния с указанными фотографиями не найдена'},
            status=status.HTTP_404_NOT_FOUND,
        )




class PhotoLineGetUpdateParentAPIView(RetrieveUpdateAPIView):
    """Получение одной фотолинии или обновления родителя фотолинии."""
    http_method_names = ('get', 'patch')
    serializer_class = PhotoLineSerializer
    queryset = PhotoLine.objects.all()
    permission_classes = [IsAuthenticated]


class PhotoLinesGetByParent(ListAPIView):
    """Получение всех фотолиний родителя"""
    serializer_class = PhotoLineSerializer
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]
    lookup_field = 'parent'

    def get_queryset(self):
        parent = self.request.user
        return PhotoLine.objects.filter(parent=parent, photo_theme__is_active=True)


class CurrentPhotoThemeRetrieveAPIView(RetrieveAPIView):
    """
    Получение информации об актуальной теме фотосессии.
    """
    queryset = PhotoTheme.objects.filter(is_active=True)
    serializer_class = CurrentPhotoThemeRetrieveSerializer
