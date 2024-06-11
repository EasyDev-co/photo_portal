from rest_framework import serializers
from apps.parent.models.parent import Parent


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('kindergarten',)
