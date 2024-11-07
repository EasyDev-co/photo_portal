from rest_framework import serializers
from apps_crm.client_cards.models import ClientCardTask

class ClientCardTaskReadSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения задач"""
    author_fi = serializers.ReadOnlyField()
    executor_fi = serializers.ReadOnlyField()
    task_status_name = serializers.ReadOnlyField()
    task_type_name = serializers.ReadOnlyField()

    class Meta:
        model = ClientCardTask
        fields = [
            'id', 'author_fi', 'executor_fi', 'client_card', 'text',
            'revision_comment', 'created_at', 'task_status_name',
            'task_type_name', 'date_end'
        ]

class ClientCardTaskWriteSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и редактирования задач"""

    class Meta:
        model = ClientCardTask
        fields = [
            'id', 'author', 'executor', 'client_card', 'text',
            'revision_comment', 'task_status', 'task_type', 'date_end'
        ]
