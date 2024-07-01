from apps.user.api.v1.serializers import UserTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class UserLoginAPIView(TokenObtainPairView):
    """Представление для авторизации пользователя."""
    serializer_class = UserTokenObtainPairSerializer
