from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def generate_tokens_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    refresh['email'] = user.email
    refresh['role'] = user.role
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }
