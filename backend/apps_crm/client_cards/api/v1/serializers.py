from rest_framework import serializers

from apps.kindergarten.models import Kindergarten


class KindergartenCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kindergarten
        fields = ("name", "code", "region")


class KindergartenUpdateSerializer(KindergartenCreateSerializer):
    pass
