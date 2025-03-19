import requests

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from itertools import zip_longest

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from apps.photo.api.v1.serializers import PhotoLineSerializer

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404

from apps.user.permissions import IsSuperUser
from .serializers import PhotoUploadSerializer, PhotoThemeSerializerV2, DirectPhotoUploadSerializer
from apps.photo.models import Photo, PhotoLine, UserPhotoCount, PhotoTheme
from apps.photo.permissions import HasPermissionCanViewPhotoLine
from apps.user.models.user import User, UserRole
from apps.photo.filters import PhotoThemeFilter
from apps.kindergarten.models import Kindergarten
from apps_crm.roles.models import UserRole as CRMUserRole

from loguru import logger

from config.settings import PHOTO_LINE_URL, UPLOAD_SERVICE_SECRET_KEY, GO_UPLOAD_URL
from apps.utils.services import generate_qr_code
from django.core.files.base import ContentFile


class PhotoUploadView(APIView):
    """Загрузка фотографий"""

    # permission_classes = [IsAuthenticated]
    # authentication_classes = [SessionAuthentication]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'numbers': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Список номеров кадров."
                )
            },
            required=['numbers']
        ),
        responses={200: PhotoLineSerializer()},
    )
    def post(self, request, *args, **kwargs):
        logger.info(f"req_data: {request.data}")
        serializer = PhotoUploadSerializer(data=request.data)

        if serializer.is_valid():
            kindergarten = serializer.validated_data['kindergarten']
            photos = serializer.validated_data['photos']
            photo_theme = kindergarten.kindergartenphototheme.get(is_active=True).photo_theme
            self.save_photos(kindergarten, photos, photo_theme)
            return Response({'detail': 'Файлы успешно загружены!'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def save_photos(self, instance, photos, photo_theme):
        with transaction.atomic():
            last_photo_number = Photo.objects.filter(
                photo_line__kindergarten=instance,
                photo_line__photo_theme=photo_theme
            ).aggregate(Max('number'))['number__max'] or 6
            next_photo_number = last_photo_number + 1

            logger.info(f"LAST_PHOTO_NUMBER: {last_photo_number}")
            logger.info(f"NEXT_PHOTO_NUMBER: {next_photo_number}")

            groups = self._grouper(photos, 6)

            for group in groups:
                # Создаем новую фото линию
                photo_line = PhotoLine.objects.create(
                    kindergarten=instance,
                    photo_theme=photo_theme,
                )

                photo_numbers = []

                for i, photo_file in enumerate(filter(None, group)):
                    serial_number = i + 1
                    photo = Photo.objects.create(
                        photo_line=photo_line,
                        number=next_photo_number,
                        photo_file=photo_file,
                        serial_number=serial_number,
                    )
                    photo_numbers.append(photo.number)
                    next_photo_number += 1

                self.generate_qr_code_for_photo_line(photo_line, photo_numbers)

    @staticmethod
    def generate_qr_code_for_photo_line(photo_line, photo_numbers):
        """
        Метод для генерации QR-кода для объекта PhotoLine.
        """
        kindergarten_code = photo_line.kindergarten.code

        logger.info(f"photo_num: {photo_numbers}")

        if not photo_numbers:
            logger.warning("Список номеров фотографий пуст, пропускаем генерацию QR-кода.")
            return

        qr_code, buffer = generate_qr_code(
            photo_line_id=photo_line.id,
            url=PHOTO_LINE_URL,
            kindergarten_code=kindergarten_code,
            photo_numbers=photo_numbers,
        )

        buffer.seek(0)
        qr_code_filename = f'{str(photo_line.photo_theme.id)}/{str(photo_line.photo_theme.name)}_qr.png'
        photo_line.qr_code.save(qr_code_filename, ContentFile(buffer.read()), save=True)

    @staticmethod
    def _grouper(iterable, n, fillvalue=None):
        """Группировка по n элементов с заполнением отсутствующих значений."""
        args = [iter(iterable)] * n
        return zip_longest(*args, fillvalue=fillvalue)


class PhotoUploadAPIView(APIView):
    """Загрузка фотографий"""

    upload_url: str = GO_UPLOAD_URL
    secret_key: str = UPLOAD_SERVICE_SECRET_KEY

    swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'numbers': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Список номеров кадров."
                )
            },
            required=['numbers']
        ),
        responses={200: PhotoLineSerializer()},
    )

    def post(self, request, *args, **kwargs):
        logger.info(f"ser_data")
        serializer = PhotoUploadSerializer(data=request.data)
        logger.info("in post")

        if serializer.is_valid():
            logger.info("valid_ser")
            kindergarten = serializer.validated_data['kindergarten']
            photos = serializer.validated_data['photos']
            photo_theme = kindergarten.kindergartenphototheme.get(is_active=True).photo_theme
            region = kindergarten.region
            logger.info("upload_photos")
            uploaded_photos = self.get_photos(
                kindergarten=kindergarten,
                photos=photos,
                photo_theme=photo_theme,
                region=region,
            )
            self.save_photos(kindergarten, uploaded_photos, photo_theme)

            return Response({'detail': 'Файлы успешно загружены!'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def save_photos(self, kindergarten, photos, photo_theme):
        with transaction.atomic():
            # Получаем последний номер фото для текущего photo_line
            last_photo_number = Photo.objects.filter(
                photo_line__kindergarten=kindergarten,
                photo_line__photo_theme=photo_theme
            ).aggregate(Max('number'))['number__max'] or 6
            next_photo_number = last_photo_number + 1

            logger.info(f"LAST_PHOTO_NUMBER: {last_photo_number}")
            logger.info(f"NEXT_PHOTO_NUMBER: {next_photo_number}")

            groups = self._grouper(photos, 6)

            for group in groups:
                photo_line = PhotoLine.objects.create(
                    kindergarten=kindergarten,
                    photo_theme=photo_theme,
                )

                photo_numbers = []

                for i, photo_data in enumerate(filter(None, group)):
                    # Получаем ссылки на оригинальное фото и с водяным знаком
                    original_url = photo_data.get('original_photo')
                    watermarked_url = photo_data.get('watermarked_photo')

                    photo = Photo.objects.create(
                        photo_line=photo_line,
                        number=next_photo_number,
                        photo_path=original_url,
                        watermarked_photo_path=watermarked_url,
                        serial_number=i + 1,
                    )
                    photo_numbers.append(photo.number)
                    next_photo_number += 1

                self.generate_qr_code_for_photo_line(photo_line, photo_numbers)

    def get_photos(self, kindergarten, photo_theme, region, photos):
        logger.info(f"get_photos: {photos}")
        files_payload = [
            ('files', (photo.name, photo.file)) for photo in photos
        ]
        logger.info(f"files_payload: {files_payload}")
        try:
            logger.info("try post")
            response = requests.post(
                self.upload_url,
                files=files_payload,
                headers={"Authorization-Token": self.secret_key},
                params={"kindergarten": kindergarten.name, "photo_theme": photo_theme.name, "region": region.name}
            )
            logger.info(f"status_code: {response.status_code}")
            if response.status_code == 200:
                logger.info(f"response: {response.json()}")
                return response.json()

        except Exception as e:
            logger.error(e)
            raise e

    @staticmethod
    def _grouper(iterable, n, fillvalue=None):
        """Группировка по n элементов с заполнением отсутствующих значений."""
        args = [iter(iterable)] * n
        return zip_longest(*args, fillvalue=fillvalue)

    @staticmethod
    def generate_qr_code_for_photo_line(photo_line, photo_numbers):
        """
        Метод для генерации QR-кода для объекта PhotoLine.
        """
        kindergarten_code = photo_line.kindergarten.code

        logger.info(f"photo_num: {photo_numbers}")

        if not photo_numbers:
            logger.warning("Список номеров фотографий пуст, пропускаем генерацию QR-кода.")
            return

        qr_code, buffer = generate_qr_code(
            photo_line_id=photo_line.id,
            url=PHOTO_LINE_URL,
            kindergarten_code=kindergarten_code,
            photo_numbers=photo_numbers,
        )
        buffer.seek(0)
        qr_code_filename = f'{str(photo_line.photo_theme.id)}/{str(photo_line.photo_theme.name)}_qr.png'
        photo_line.qr_code.save(qr_code_filename, ContentFile(buffer.read()), save=True)


class DirectPhotoUploadAPIView(APIView):
    """Прямая загрузка фотографий"""

    swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'kindergarten_id': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID детского сада"
                ),
                'photos': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'original_photo': openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="URL на оригинальное фото в S3"
                            ),
                            'watermarked_photo': openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="URL на фото с водяным знаком в S3"
                            )
                        },
                        required=['original_photo', 'watermarked_photo']
                    ),
                    description="Список загруженных фотографий"
                )
            },
            required=['kindergarten_id', 'photos']
        ),
        responses={200: "Файлы успешно загружены!"},
    )

    permission_classes = [IsAuthenticated, IsSuperUser, IsAdminUser]

    def post(self, request, *args, **kwargs):
        logger.info("Start DirectPhotoUploadAPIView")
        serializer = DirectPhotoUploadSerializer(data=request.data)

        if serializer.is_valid():
            logger.info("Serializer is valid")
            kindergarten = serializer.validated_data['kindergarten']
            photos = serializer.validated_data['photos']
            photo_theme = kindergarten.kindergartenphototheme.get(is_active=True).photo_theme

            logger.info("Calling save_photos")
            self.save_photos(kindergarten, photos, photo_theme)

            return Response({'detail': 'Файлы успешно загружены!'}, status=status.HTTP_201_CREATED)

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def save_photos(self, kindergarten, photos, photo_theme):
        with transaction.atomic():
            last_photo_number = Photo.objects.filter(
                photo_line__kindergarten=kindergarten,
                photo_line__photo_theme=photo_theme
            ).aggregate(Max('number'))['number__max'] or 6
            next_photo_number = last_photo_number + 1

            logger.info(f"LAST_PHOTO_NUMBER: {last_photo_number}")
            logger.info(f"NEXT_PHOTO_NUMBER: {next_photo_number}")

            groups = self._grouper(photos, 6)

            for group in groups:
                photo_line = PhotoLine.objects.create(
                    kindergarten=kindergarten,
                    photo_theme=photo_theme,
                )

                photo_numbers = []

                for i, photo_data in enumerate(filter(None, group)):
                    original_url = photo_data.get('original_photo')
                    watermarked_url = photo_data.get('watermarked_photo')

                    photo = Photo.objects.create(
                        photo_line=photo_line,
                        number=next_photo_number,
                        photo_path=original_url,
                        watermarked_photo_path=watermarked_url,
                        serial_number=i + 1,
                    )
                    photo_numbers.append(photo.number)
                    next_photo_number += 1

                self.generate_qr_code_for_photo_line(photo_line, photo_numbers)

    @staticmethod
    def _grouper(iterable, n, fillvalue=None):
        args = [iter(iterable)] * n
        return zip_longest(*args, fillvalue=fillvalue)

    @staticmethod
    def generate_qr_code_for_photo_line(photo_line, photo_numbers):
        kindergarten_code = photo_line.kindergarten.code

        if not photo_numbers:
            logger.warning("Список номеров фотографий пуст, пропускаем генерацию QR-кода.")
            return

        qr_code, buffer = generate_qr_code(
            photo_line_id=photo_line.id,
            url=PHOTO_LINE_URL,
            kindergarten_code=kindergarten_code,
            photo_numbers=photo_numbers,
        )
        buffer.seek(0)
        qr_code_filename = f'{str(photo_line.photo_theme.id)}/{str(photo_line.photo_theme.name)}_qr.png'
        photo_line.qr_code.save(qr_code_filename, ContentFile(buffer.read()), save=True)


class PhotoLineGetByPhotoNumberAPIView(APIView):
    """Получение фото-линии по номерам фотографий"""
    permission_classes = [IsAuthenticated, HasPermissionCanViewPhotoLine]

    def post(self, request):
        """Получение фото-линии по номерам фотографий"""

        user = request.user
        numbers_list = request.data.get('numbers', '')

        logger.info(f"numbers_list: {numbers_list}")

        if user.role == UserRole.parent:  # список из 1 или 6 элементов
            kindergarten = user.kindergarten.all().first()
        elif user.role == UserRole.manager:
            kindergarten = user.managed_kindergarten

        # Валидация номеров фотографий
        validation_response = self.validate_numbers(numbers_list)
        if isinstance(validation_response, Response):
            return validation_response
        photo_numbers = validation_response

        # Проверка существования д/с
        active_photo_theme_response = self.get_active_photo_theme(kindergarten)
        if isinstance(active_photo_theme_response, Response):
            return active_photo_theme_response
        active_photo_theme = active_photo_theme_response

        # Получение фотографий и проверка их целостности
        photos_response = self.get_photos(photo_numbers, active_photo_theme, kindergarten)
        if isinstance(photos_response, Response):
            return photos_response
        photo_line = photos_response

        # Проверка наличия связи пробника с д/с и активной фотосессией
        photo_line_response = self.validate_photo_line(kindergarten, active_photo_theme, photo_line)
        if isinstance(photo_line_response, Response):
            return photo_line_response

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

        # Сохранение родителя для пробника
        if photo_line.parent is None:
            photo_line.parent = user
            photo_line.save()

        # Сериализация и возврат данных
        serializer = PhotoLineSerializer(photo_line)
        return Response(serializer.data)

    @staticmethod
    def validate_numbers(photo_numbers):
        """Валидация строки с номерами фотографий"""
        if not photo_numbers:
            return Response(
                {'message': 'Необходимо указать номера фотографий.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка, что указано не больше 6 символов
        if len(photo_numbers) > 6:
            return Response(
                {'message': 'Необходимо указать 1 или 6 номеров фотографий.'},
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
    def get_photos(photo_numbers, active_photo_theme, kindergarten):
        """Получение фотографий и проверка их принадлежности к одному пробнику"""
        logger.info(f"photo_num: {photo_numbers}")
        logger.info(f"active_photo_theme: {active_photo_theme}")
        logger.info(f"kindergarten: {kindergarten}")

        logger.info(f"type phot theme: {type(active_photo_theme)}")
        logger.info(f"type kindergarten: {type(kindergarten)}")

        photos = Photo.objects.filter(
            number__in=photo_numbers,
            photo_line__photo_theme=active_photo_theme,
            photo_line__kindergarten=kindergarten,
        )

        # Проверка, что все фотографии принадлежат одному пробнику
        photo_line_ids = photos.values_list('photo_line', flat=True).distinct()
        if photo_line_ids.count() != 1:
            return Response(
                {'message': 'Фотографии не принадлежат одному пробнику.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        photo_line = get_object_or_404(PhotoLine, pk=photo_line_ids.first())
        return photo_line

    @staticmethod
    def check_photo_line_permissions(photo_line, user):
        """Проверка, что пользователь имеет доступ к пробнику"""
        error_response = Response(
            {'message': 'Пробник не относится к вашему детскому саду'},
            status=status.HTTP_403_FORBIDDEN,
        )

        if user.role == UserRole.parent and photo_line.kindergarten not in user.kindergarten.all():
            return error_response

        if user.role == UserRole.manager and photo_line.kindergarten != user.managed_kindergarten:
            return error_response

        return None

    @staticmethod
    def check_photo_numbers_in_line(photo_numbers, photo_line):
        """Проверка, что номера фотографий соответствуют номерам в пробнике"""
        if len(photo_numbers) == 1:
            return None

        numbers_in_photo_line = list(
            photo_line.photos.values_list('number', flat=True)
        )

        if not set(photo_numbers).issubset(set(numbers_in_photo_line)):
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

    @staticmethod
    def get_active_photo_theme(kindergarten):
        return kindergarten.kindergartenphototheme.get(is_active=True).photo_theme

    @staticmethod
    def validate_photo_line(kindergarten, active_photo_theme, photo_line):
        if kindergarten != photo_line.kindergarten:
            return Response(
                {'message': 'Пробник не относится к вашему детскому саду'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if photo_line.photo_theme != active_photo_theme:
            return Response(
                {'message': 'Пробник не относится к текущей фотосессии.'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
                {'message': 'Родитель и пробник принадлежат разным детским садам.'},
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
    queryset = PhotoTheme.objects.filter(kindergartenphototheme__is_active=True)
    serializer_class = PhotoThemeSerializerV2
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PhotoThemeFilter

    def get_queryset(self):
        user = self.request.user
        employee = getattr(user, 'employee', None)
        queryset = super().get_queryset()

        # Фильтрация для менеджеров
        if employee and employee.employee_role == CRMUserRole.MANAGER:
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
        elif employee and employee.employee_role in {CRMUserRole.ROP}:
            # Проверка на указанный регион
            region_id = self.request.query_params.get('region')
            if region_id:
                queryset = queryset.filter(kindergarten__region_id=region_id)

            # Проверка на указанного менеджера
            manager_id = self.request.query_params.get('manager')
            if manager_id:
                queryset = queryset.filter(kindergarten__clientcard__responsible_manager_id=manager_id)

        return queryset
