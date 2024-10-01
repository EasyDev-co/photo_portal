from auditlog.models import LogEntry
from rest_framework import serializers


class HistorySerializer(serializers.ModelSerializer):
    action = serializers.CharField(source='get_action_display')
    user_id = serializers.CharField(source='actor.id', default='System')
    object = serializers.SerializerMethodField()

    class Meta:
        model = LogEntry
        fields = ['id', 'action', 'timestamp', 'changes', 'object', 'user_id']

    def get_object(self, obj):
        return obj.object_repr
