import requests
import uuid
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
def mailru_login(request):
    """Логин через Mail.ru"""
    try:
        callback_url = settings.MAILRU_REDIRECT_URI
        state = str(uuid.uuid4())
        request.session['oauth_state'] = state
        authorization_url = (
            f"https://oauth.mail.ru/login?client_id={settings.MAILRU_CLIENT_ID}"
            f"&response_type=code&redirect_uri={callback_url}&scope=userinfo"
            f"&state={state}"
        )
        return redirect(authorization_url)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def mailru_callback(request):
    """Обработка callback после авторизации через Mail.ru"""
    code = request.GET.get('code')
    state = request.GET.get('state')
    session_state = request.session.get('oauth_state')

    if not code:
        return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

    if not state or state != session_state:
        return Response({"error": "Invalid state parameter"}, status=status.HTTP_400_BAD_REQUEST)

    # Удаляем state из сессии
    del request.session['oauth_state']

    data = {
        'client_id': settings.MAILRU_CLIENT_ID,
        'client_secret': settings.MAILRU_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.MAILRU_REDIRECT_URI,
    }

    try:
        # Получение access_token
        response = requests.post('https://oauth.mail.ru/token', data=data)
        response.raise_for_status()
        token_data = response.json()
        access_token = token_data.get('access_token')

        # Получение информации о пользователе
        params = {'access_token': access_token}
        user_info_response = requests.get('https://oauth.mail.ru/userinfo', params=params)
        user_info_response.raise_for_status()
        user_info = user_info_response.json()

        email = user_info.get('email')
        first_name = user_info.get('first_name')
        last_name = user_info.get('last_name')

        if not email:
            return Response({"error": "No email provided by Mail.ru"}, status=status.HTTP_400_BAD_REQUEST)

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
