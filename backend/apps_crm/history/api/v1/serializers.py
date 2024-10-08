from auditlog.models import LogEntry
from rest_framework import serializers


class HistorySerializer(serializers.ModelSerializer):
    """Сериализатор для истории изменений объекта."""
    action = serializers.CharField(source='get_action_display')
    user_id = serializers.CharField(source='actor.id', default='System')
    object = serializers.SerializerMethodField()

    class Meta:
        model = LogEntry
        fields = ['id', 'action', 'timestamp', 'changes', 'object', 'user_id']

    def get_object(self, obj):
        return obj.object_repr


class ObjectHistorySerializer(serializers.Serializer):
    """Сериализатор для получения истории объекта."""
    model_name = serializers.CharField()
    object_id = serializers.UUIDField()

    def validate_model_name(self, value):
        return value.lower()
