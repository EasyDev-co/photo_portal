import requests
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from django.core.mail import send_mail
from requests.exceptions import RequestException
from apps.oauth.api.v1.utils import create_or_get_user


@api_view(['GET'])
def yandex_login(request):
    """Логин через Яндекс"""
    try:
        callback_url = settings.YANDEX_REDIRECT_URI
        authorization_url = (
            f"https://oauth.yandex.ru/authorize?response_type=code"
            f"&client_id={settings.YANDEX_CLIENT_ID}"
            f"&redirect_uri={callback_url}"
        )
        return redirect(authorization_url)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def yandex_callback(request):
    """Обработка callback после авторизации через Яндекс"""
    code = request.GET.get('code')
    if not code:
        return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': settings.YANDEX_CLIENT_ID,
        'client_secret': settings.YANDEX_CLIENT_SECRET,
    }

    try:
        # Получение access_token
        token_response = requests.post('https://oauth.yandex.ru/token', data=data)
        token_response.raise_for_status()
        token_data = token_response.json()
        access_token = token_data.get('access_token')

        # Получение информации о пользователе
        headers = {'Authorization': f'OAuth {access_token}'}
        user_info_response = requests.get('https://login.yandex.ru/info', headers=headers)
        user_info_response.raise_for_status()
        user_info = user_info_response.json()

        email = user_info.get('default_email') or (user_info.get('emails') and user_info.get('emails')[0])
        first_name = user_info.get('first_name')
        last_name = user_info.get('last_name')

        if not email:
            return Response({"error": "No email provided by Yandex"}, status=status.HTTP_400_BAD_REQUEST)

        # Создание или получение пользователя
        user, created = create_or_get_user(email, first_name, last_name)

        if created:
            # Отправка приветственного письма (опционально)
            send_mail(
                'Добро пожаловать!',
                'Пожалуйста, подтвердите ваш email.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

        # Авторизация пользователя
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        # Редирект на фронтенд с токеном
        frontend_url = settings.FRONTEND_URL
        redirect_url = f"{frontend_url}/auth/callback?token={access_token}"
        return Response({"url": redirect_url}, status=status.HTTP_200_OK)

    except RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
