from rest_framework import serializers
from apps_crm.client_cards.models import ClientCard, ClientCardTask, HistoryCall, Notes
from apps_crm.roles.models import Employee


class BaseClientCardSerializer(serializers.ModelSerializer):
    def validate_author(self, value):
        if not Employee.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Указанный автор не существует.")
        return value

    def validate_client_card(self, value):
        if not ClientCard.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Указанная карточка клиента не существует.")
        return value


class ClientCardTaskSerializer(BaseClientCardSerializer):
    class Meta:
        model = ClientCardTask
        fields = '__all__'


class HistoryCallSerializer(BaseClientCardSerializer):
    class Meta:
        model = HistoryCall
        fields = '__all__'


class NotesSerializer(BaseClientCardSerializer):
    class Meta:
        model = Notes
        fields = '__all__'
