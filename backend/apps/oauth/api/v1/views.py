import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken
from apps.oauth.api.v1.utils import create_or_get_user
from requests.exceptions import RequestException

from apps.utils.services.generate_tokens_for_user import generate_tokens_for_user


@api_view(['POST'])
def oauth_token_login(request):
    """
    Вход через OAuth access_token.
    Ожидаемые данные POST:
    {
        'provider': 'google' или 'yandex' или 'mailru',
        'access_token': 'строка access_token'
    }
    """
    provider = request.data.get('provider')
    access_token = request.data.get('access_token')

    if not provider or not access_token:
        return Response({"error": "Provider and access_token are required"}, status=status.HTTP_400_BAD_REQUEST)

    if provider == 'google':
        # Проверка токена с Google
        user_info_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        params = {'access_token': access_token}
        try:
            user_info_response = requests.get(user_info_url, params=params)
            user_info_response.raise_for_status()
            user_info = user_info_response.json()

            email = user_info.get('email')
            first_name = user_info.get('given_name')
            last_name = user_info.get('family_name')

            # Создание или получение пользователя
            user, created = create_or_get_user(email, first_name, last_name)

            return Response(generate_tokens_for_user(user), status=status.HTTP_200_OK)
        except RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif provider == 'yandex':
        # Проверка токена с Яндекс
        user_info_url = 'https://login.yandex.ru/info'
        headers = {'Authorization': f'OAuth {access_token}'}
        try:
            user_info_response = requests.get(user_info_url, headers=headers)
            user_info_response.raise_for_status()
            user_info = user_info_response.json()

            email = user_info.get('default_email') or (user_info.get('emails') and user_info.get('emails')[0])
            first_name = user_info.get('first_name')
            last_name = user_info.get('last_name')

            if not email:
                return Response({"error": "No email provided by Yandex"}, status=status.HTTP_400_BAD_REQUEST)

            user, created = create_or_get_user(email, first_name, last_name)

            return Response(data=generate_tokens_for_user(user), status=status.HTTP_200_OK)
        except RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif provider == 'mailru':
        # Проверка токена с Mail.ru
        user_info_url = 'https://oauth.mail.ru/userinfo'
        params = {'access_token': access_token}
        try:
            user_info_response = requests.get(user_info_url, params=params)
            user_info_response.raise_for_status()
            user_info = user_info_response.json()

            email = user_info.get('email')
            first_name = user_info.get('first_name')
            last_name = user_info.get('last_name')

            if not email:
                return Response({"error": "No email provided by Mail.ru"}, status=status.HTTP_400_BAD_REQUEST)

            user, created = create_or_get_user(email, first_name, last_name)

            return Response(data=generate_tokens_for_user(user), status=status.HTTP_200_OK)
        except RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid provider"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    """Выход из аккаунта"""
    logout(request)
    return Response({"message": "Вы вышли из системы"}, status=status.HTTP_200_OK)
