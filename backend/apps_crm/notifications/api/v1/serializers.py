from rest_framework import serializers

from apps_crm.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'url', 'created', 'content_object']
        read_only_fields = ['id', 'created', 'content_object']

    def get_content_object(self, obj):
        from apps.user.models import User

        content_type = obj.content_type
        model_class = content_type.model_class()

        if model_class == User:
            from apps.user.api.v1.serializers import UserSerializer
            return UserSerializer(obj.content_object).data
        else:
            return {"detail": "Модель не найдена"}


class MarkNotificationAsReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'is_read']
        read_only_fields = ['id']


class NotificationReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'sender', 'message', 'url', 'is_read', 'created']
        read_only_fields = ['id', 'user', 'sender', 'message', 'url', 'is_read', 'created']