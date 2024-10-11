from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout


@api_view(['POST'])
def logout_view(request):
    """Выход из аккаунта"""
    logout(request)
    return Response({"message": "Вы вышли из системы"}, status=status.HTTP_200_OK)
