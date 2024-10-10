from django.urls import path
from apps.oauth.api.v1.providers import google, yandex, mailru
from apps.oauth.api.v1 import views

urlpatterns = [
    # Google URLs
    path('login/google/', google.google_login, name='oauth_google_login'),
    path('callback/google/', google.google_callback, name='oauth_google_callback'),

    # Yandex URLs
    path('login/yandex/', yandex.yandex_login, name='oauth_yandex_login'),
    path('callback/yandex/', yandex.yandex_callback, name='oauth_yandex_callback'),

    # Mail.ru URLs
    path('login/mailru/', mailru.mailru_login, name='oauth_mailru_login'),
    path('callback/mailru/', mailru.mailru_callback, name='oauth_mailru_callback'),

    # Logout
    path('logout/', views.logout_view, name='oauth_logout'),
]
