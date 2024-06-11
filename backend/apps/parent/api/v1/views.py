from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView

from apps.kindergarten.models import Kindergarten
from apps.parent.models.parent import Parent
from apps.user.api.v1.serializers import UserSerializer
from apps.user.models import User


class ParentRegisterAPIView(CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        password = validated_data.pop('password')
        kindergarten_code: str = validated_data.pop('kindergarten_code', None)

        if kindergarten_code:
            try:
                kindergarten = Kindergarten.objects.get(code=kindergarten_code)
            except Kindergarten.DoesNotExist:
                raise ValidationError({'message': "Такого садика не существует."})
            else:
                user = User.objects.create_user(
                    password=password,
                    **validated_data
                    )

                parent = Parent.objects.create(user=user)
                parent.kindergarten.add(kindergarten)
                user.role = 'parent'
                user.save()

                return user
