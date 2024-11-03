from rest_framework.authentication import SessionAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from itertools import zip_longest

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from apps.photo.api.v1.serializers import PhotoLineSerializer

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404

from .serializers import PhotoUploadSerializer, PhotoThemeSerializerV2
from apps.photo.models import Photo, PhotoLine, UserPhotoCount, PhotoTheme
from apps.photo.permissions import HasPermissionCanViewPhotoLine
from apps.user.models.user import User
from apps.photo.filters import PhotoThemeFilter
from apps.kindergarten.models import Kindergarten
from apps_crm.roles.models import UserRole


class PhotoUploadView(APIView):
    """Загрузка фотографий"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'numbers': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Номера кадров, разделенные знаком '-', например, '10-11-12-13-14-15'"
                )
            },
            required=['numbers']
        ),
        responses={200: PhotoLineSerializer()},
    )
    def post(self, request, *args, **kwargs):
        serializer = PhotoUploadSerializer(data=request.data)

        if serializer.is_valid():
            kindergarten = serializer.validated_data['kindergarten']
            photos = serializer.validated_data['photos']
            photo_theme = serializer.validated_data['photo_theme']
            self.save_photos(kindergarten, photos, photo_theme)
            return Response({'detail': 'Файлы успешно загружены!'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def save_photos(self, instance, photos, photo_theme):
        with transaction.atomic():
            last_photo_number = Photo.objects.filter(
                photo_line__kindergarten=instance
            ).aggregate(Max('number'))['number__max'] or 0
            next_photo_number = last_photo_number + 1

            groups = self._grouper(photos, 6)

            for group in groups:
                # Создаем новую фото линию
                photo_line = PhotoLine.objects.create(
                    kindergarten=instance,
                    photo_theme=photo_theme,
                )

                for i, photo_file in enumerate(filter(None, group)):
                    serial_number = i + 1  # От 1 до 6
                    Photo.objects.create(
                        photo_line=photo_line,
                        number=next_photo_number,
                        photo_file=photo_file,
                        serial_number=serial_number,
                    )
                    next_photo_number += 1

    @staticmethod
    def _grouper(iterable, n, fillvalue=None):
        """Группировка по n элементов с заполнением отсутствующих значений."""
        args = [iter(iterable)] * n
        return zip_longest(*args, fillvalue=fillvalue)


class PhotoLineGetByPhotoNumberAPIView(APIView):
    """Получение фото-линии по номерам фотографий"""
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]

    def post(self, request):
        """Получение фото-линии по номерам фотографий"""

        user = request.user
        numbers_str = request.data.get('numbers', '')

        # Валидация номеров фотографий
        validation_response = self.validate_numbers(numbers_str)
        if isinstance(validation_response, Response):
            return validation_response
        photo_numbers = validation_response

        # Получение фотографий и проверка их целостности
        photos_response = self.get_photos(photo_numbers)
        if isinstance(photos_response, Response):
            return photos_response
        photos, photo_line = photos_response

        # Проверка прав доступа пользователя к фото линии
        permission_response = self.check_photo_line_permissions(photo_line, user)
        if isinstance(permission_response, Response):
            return permission_response

        # Проверка соответствия номеров фотографий номерам в фото линии
        numbers_check_response = self.check_photo_numbers_in_line(photo_numbers, photo_line)
        if isinstance(numbers_check_response, Response):
            return numbers_check_response

        # Проверка и обновление лимита пользователя
        limit_response = self.check_user_photo_limit(user, photo_line)
        if isinstance(limit_response, Response):
            return limit_response

        # Сериализация и возврат данных
        serializer = PhotoLineSerializer(photo_line)
        return Response(serializer.data)

    @staticmethod
    def validate_numbers(numbers_str):
        """Валидация строки с номерами фотографий"""
        if not numbers_str:
            return Response(
                {'message': 'Необходимо указать номера фотографий.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        photo_numbers = numbers_str.strip().split('-')

        # Проверка, что указано ровно 6 номеров
        if len(photo_numbers) != 6:
            return Response(
                {'message': 'Должно быть ровно 6 номеров фотографий.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Преобразование номеров в целые числа и проверка порядка
        try:
            photo_numbers = [int(num) for num in photo_numbers]
        except ValueError:
            return Response(
                {'message': 'Номера фотографий должны быть числами.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка, что номера идут по возрастанию
        if photo_numbers != sorted(photo_numbers):
            return Response(
                {'message': 'Номера фотографий должны быть в порядке возрастания.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка, что номера положительные
        if any(num <= 0 for num in photo_numbers):
            return Response(
                {'message': 'Номера фотографий должны быть положительными числами.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return photo_numbers

    @staticmethod
    def get_photos(photo_numbers):
        """Получение фотографий и проверка их принадлежности к одной фотолинии"""
        photos = Photo.objects.filter(number__in=photo_numbers)

        # Проверка, что найдены все 6 фотографий
        if photos.count() != 6:
            return Response(
                {'message': 'Некоторые из указанных номеров фотографий не найдены.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверка, что все фотографии принадлежат одной фотолинии
        photo_line_ids = photos.values_list('photo_line', flat=True).distinct()
        if photo_line_ids.count() != 1:
            return Response(
                {'message': 'Фотографии не принадлежат одной фотолинии.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        photo_line = get_object_or_404(PhotoLine, pk=photo_line_ids.first())
        return photos, photo_line

    @staticmethod
    def check_photo_line_permissions(photo_line, user):
        """Проверка, что пользователь имеет доступ к фотолинии"""
        if photo_line.kindergarten not in user.kindergarten.all():
            return Response(
                {'message': 'Фотолиния не относится к вашему детскому саду'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    @staticmethod
    def check_photo_numbers_in_line(photo_numbers, photo_line):
        """Проверка, что номера фотографий соответствуют номерам в фотолинии"""
        numbers_in_photo_line = list(
            photo_line.photos.values_list('number', flat=True)
        )

        if set(photo_numbers) != set(numbers_in_photo_line):
            return Response(
                {'message': 'Пробник с указанными фотографиями не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return None

    @staticmethod
    def check_user_photo_limit(user, photo_line):
        """Проверка и обновление лимита пользователя на просмотр фотографий"""
        user_photo_count, created = UserPhotoCount.objects.get_or_create(
            user=user,
            photo_theme=photo_line.photo_theme,
        )

        if user_photo_count.count == 0:
            return Response(
                {'message': 'Вы достигли лимита'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Уменьшаем счетчик и сохраняем
        user_photo_count.count -= 1
        user_photo_count.save()
        return None


class PhotoLineGetUpdateParentAPIView(RetrieveUpdateAPIView):
    """Получение одного пробника или обновление родителя пробника."""
    http_method_names = ('get', 'patch')
    serializer_class = PhotoLineSerializer
    queryset = PhotoLine.objects.all()
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        """Обновление родителя пробника с дополнительными проверками."""
        user = request.user
        instance = self.get_object()
        parent_id = request.data.get('parent')

        # Проверка наличия поля 'parent' в запросе
        if 'parent' not in request.data:
            return Response(
                {'message': 'Поле "parent" является обязательным для обновления.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка, что пользователь имеет доступ к детскому саду
        kindergarten = instance.kindergarten
        if kindergarten not in user.kindergarten.all():
            return Response(
                {'message': 'Вы не имеете доступа к этому детскому саду.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Получение родителя по ID и проверка принадлежности к тому же детскому саду
        parent = self.get_parent(parent_id)
        if isinstance(parent, Response):
            return parent  # Возвращаем ошибку, если есть

        # Проверка, что родитель принадлежит тому же детскому саду
        if parent.kindergarten != kindergarten:
            return Response(
                {'message': 'Родитель и фотолиния принадлежат разным детским садам.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка лимита на количество прикреплений
        limit_response = self.check_user_photo_limit(user, instance.photo_theme)
        if isinstance(limit_response, Response):
            return limit_response

        # Обновление поля 'parent' и сохранение
        instance.parent = parent
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @staticmethod
    def get_parent(parent_id):
        """Получение объекта родителя по ID."""
        try:
            parent = User.objects.get(id=parent_id)
            return parent
        except User.DoesNotExist:
            return Response(
                {'message': 'Указанный родитель не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @staticmethod
    def check_user_photo_limit(user, photo_theme):
        """Проверка и обновление лимита пользователя на прикрепление родителя."""
        user_photo_count, created = UserPhotoCount.objects.get_or_create(
            user=user,
            photo_theme=photo_theme,
        )

        if user_photo_count.count == 0:
            return Response(
                {'message': 'Вы достигли лимита прикреплений для этой фотосессии.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Уменьшаем счетчик и сохраняем
        user_photo_count.count -= 1
        user_photo_count.save()
        return None


class GetPhotoThemeForCalendarView(viewsets.ReadOnlyModelViewSet):
    """
    Получение фотосессий для календаря.
    """
    queryset = PhotoTheme.objects.filter(is_active=True)
    serializer_class = PhotoThemeSerializerV2
    permission_classes = [IsAuthenticated]
    ilter_backends = [DjangoFilterBackend]
    filterset_class = PhotoThemeFilter

    def get_queryset(self):
        user = self.request.user
        employee = getattr(user, 'employee', None)
        queryset = super().get_queryset()

        # Фильтрация для менеджеров
        if employee and employee.employee_role == UserRole.MANAGER:
            # Получаем детские сады, за которые отвечает менеджер
            kindergartens = Kindergarten.objects.filter(
                clientcard__responsible_manager=employee
            )

            # Фильтруем фотосессии, связанные с этими детскими садами
            queryset = queryset.filter(kindergarten__in=kindergartens)

            # Проверка на указанный регион
            region_id = self.request.query_params.get('region')
            if region_id:
                queryset = queryset.filter(kindergarten__region_id=region_id)

        # Фильтрация для директоров и РОП
        elif employee and employee.employee_role in {UserRole.DIRECTOR, UserRole.ROP}:
            # Проверка на указанный регион
            region_id = self.request.query_params.get('region')
            if region_id:
                queryset = queryset.filter(kindergarten__region_id=region_id)

            # Проверка на указанного менеджера
            manager_id = self.request.query_params.get('manager')
            if manager_id:
                queryset = queryset.filter(kindergarten__clientcard__responsible_manager_id=manager_id)

        return queryset
