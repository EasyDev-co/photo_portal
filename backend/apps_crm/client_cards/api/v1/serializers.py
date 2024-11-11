from auditlog.models import LogEntry
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from apps.kindergarten.api.v1.serializers import KindergartenSerializer
from apps.order.api.v1.serializers import OrdersPaymentBriefSerializer
from apps.order.models import OrdersPayment
from apps.photo.api.v1.serializers import PhotoThemeSerializer
from apps.photo.models import PhotoTheme
from apps.user.api.v1.serializers import ManagerSerializer
from apps.user.models.user import UserRole
from apps_crm.client_cards.models import ClientCard, ClientCardTask, HistoryCall, Notes, ClientCardStatus
from apps_crm.history.models import ManagerChangeLog
from apps_crm.roles.api.v1.serializers import EmployeeSerializer
from apps_crm.roles.models import Employee

User = get_user_model()


class BaseClientCardSerializer(serializers.ModelSerializer):
    def validate_author(self, value):
        if not Employee.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Указанный автор не существует.")
        return value

    def validate_client_card(self, value):
        if not ClientCard.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Указанная карточка клиента не существует.")
        # Проверка роли пользователя
        employee = self.context['request'].user.employee
        if employee.employee_role == UserRole.manager:
            if value.responsible_manager != employee:
                raise serializers.ValidationError("Вы не можете создавать записи для этой карточки клиента.")
        return value


class ClientCardTaskSerializer(BaseClientCardSerializer):
    author = EmployeeSerializer(read_only=True)

    class Meta:
        model = ClientCardTask
        fields = '__all__'
        read_only_fields = ['author']


class ClientCardSerializer(BaseClientCardSerializer):
    responsible_manager = EmployeeSerializer()
    kindergarten_name = serializers.SerializerMethodField()

    class Meta:
        model = ClientCard
        fields = [
            'id',
            'kindergarten',
            'children_count',
            'children_for_photoshoot',
            'responsible_manager',
            'last_photographer',
            'garden_details',
            'city',
            'address',
            'status',
            'charges',
            'charge_dates',
            "kindergarten_name",
        ]

    def get_kindergarten_name(self, obj):
        return obj.kindergarten_name


class ClientCardUpdateSerializer(BaseClientCardSerializer):

    class Meta:
        model = ClientCard
        fields = '__all__'


class HistoryCallSerializer(BaseClientCardSerializer):

    class Meta:
        model = HistoryCall
        fields = [
            'id',
            'call_status',
            'created_at',
            'author',
            'client_card',
        ]


class NotesSerializer(BaseClientCardSerializer):
    author = EmployeeSerializer(read_only=True)

    class Meta:
        model = Notes
        fields = '__all__'
        read_only_fields = ['author']


class ClientCardRetrieveSerializer(BaseClientCardSerializer):
    kindergarten = KindergartenSerializer(read_only=True)
    previous_managers = serializers.SerializerMethodField()
    orders_history = serializers.SerializerMethodField()
    change_history = serializers.SerializerMethodField()
    kindergarten_manager_info = ManagerSerializer(source='kindergarten.manager', read_only=True)
    photo_themes = serializers.SerializerMethodField()
    responsible_manager = EmployeeSerializer(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = ClientCard
        fields = [
            'id',
            'kindergarten',
            'kindergarten_manager_info',
            'children_count',
            'promocode_size',
            'manager_bonus',
            'responsible_manager',
            'previous_managers',
            'city',
            'address',
            'garden_details',
            'orders_history',
            'change_history',
            'photo_themes',
            'status',
            'charges',
            'charge_dates',
            'children_for_photoshoot'
        ]

    @staticmethod
    def get_previous_managers(obj):
        # Получаем id последних двух предыдущих менеджеров для карточки клиента
        previous_managers_list = ManagerChangeLog.objects.filter(
            client_card=obj,
            previous_manager__isnull=False
        ).order_by('-changed_at').values_list(
            'previous_manager__user', flat=True)[:2]

        users = User.objects.filter(id__in=previous_managers_list)

        managers_names = [user.full_name for user in users]

        return managers_names

    @staticmethod
    def get_photo_themes(obj):
        all_photo_themes = PhotoTheme.objects.filter(
            photo_lines__in=obj.kindergarten.photo_lines.all()
        ).distinct()
        current_photo_theme = all_photo_themes.filter(
            is_active=True
        ).first()
        context = {'kindergarten': obj.kindergarten}

        return {
            'all_photo_themes': PhotoThemeSerializer(all_photo_themes, many=True, context=context).data,
            'current_photo_theme': PhotoThemeSerializer(current_photo_theme, context=context).data
        }

    @staticmethod
    def get_orders_history(obj):
        orders = OrdersPayment.objects.filter(orders__photo_line__kindergarten=obj.kindergarten)
        return OrdersPaymentBriefSerializer(orders, many=True).data

    @staticmethod
    def get_change_history(obj):
        content_type = ContentType.objects.get_for_model(obj.__class__)
        return LogEntry.objects.filter(
            object_id=obj.id,
            content_type=content_type
        ).values_list('changes', 'timestamp')

    @staticmethod
    def get_status(obj):
        """Метод для получения названия статуса."""
        print(ClientCardStatus(obj.status).label)
        return ClientCardStatus(obj.status).label
