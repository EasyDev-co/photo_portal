from rest_framework import serializers
from apps.promocode.models.promocode import Promocode


class PromocodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocode
        fields = '__all__'
