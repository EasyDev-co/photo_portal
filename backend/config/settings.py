import os
from datetime import timedelta
from pathlib import Path
import sentry_sdk

from celery.schedules import crontab
from dotenv import load_dotenv
from sentry_sdk.integrations.django import DjangoIntegration

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = os.environ.get("DEBUG")

ALLOWED_HOSTS = ['*']

# CORS_ALLOWED_ORIGINS = [
#     "http://127.0.0.1:3000",
#     "http://localhost:3000",
#     "http://localhost:8001",
#     "http://localhost:8080",
# ]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Библиотеки
    'rest_framework',
    'django_filters',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'django_celery_beat',
    'drf_yasg',
    "phonenumber_field",

    # Приложения
    'apps.kindergarten',
    'apps.parent',
    'apps.photo',
    'apps.order',
    'apps.promocode',
    'apps.user',
    'apps.cart',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Настройки SENTRY
SENTRY_IS_ON = os.environ.get('SENTRY_IS_ON')

if SENTRY_IS_ON:
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN'),
        integrations=[
            DjangoIntegration(),
        ],
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', 5432),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "[%(asctime)s: %(levelname)s]: %(pathname)s %(message)s"},
        "verbose": {
            "format": "[%(asctime)s: %(levelname)s]: %(pathname)s:%(lineno)d %(funcName)s %(process)d %(message)s"
        },
    },
    "handlers": {"console": {"level": "INFO", "class": "logging.StreamHandler", "formatter": "standard"}},
    "loggers": {
        "root": {"handlers": ["console"], "level": "INFO"},
        "celery": {"handlers": ["console"], "level": "INFO"},
        "gunicorn.error": {"handlers": ["console"], "level": "INFO"},
        "gunicorn.access": {"handlers": ["console"], "level": "INFO"},
    },
}

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/backend_static/'
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

REGISTRATION_URL_FOR_PARENT = os.environ.get('REGISTRATION_URL_FOR_PARENT')
PHOTO_LINE_URL = os.environ.get('PHOTO_LINE_URL')

AUTH_USER_MODEL = 'user.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

REDIS_HOST = os.environ.get('REDIS_HOST')
REDIS_PORT = os.environ.get('REDIS_PORT')
REDIS_DB_CELERY = os.environ.get('REDIS_DB_CELERY')

CELERY_BROKER_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB_CELERY}'
CELERY_TIMEZONE = "Europe/Moscow"
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.yandex.ru')
EMAIL_PORT = os.environ.get('EMAIL_PORT', 587)
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL = EMAIL_HOST_USER
EMAIL_ADMIN = EMAIL_HOST_USER

CELERY_BEAT_SCHEDULE = {
    "resend_code": {
        "task": "apps.user.tasks.ResendConfirmCodeTask",
        "schedule": crontab(minute="*/1"),
    },
    "check_photo_theme_deadlines": {
        "task": "apps.order.tasks.CheckPhotoThemeDeadlinesTask",
        "schedule": crontab(minute='0', hour='*/2'),  # проверка каждые два часа
    },
    "remove_old_qr_codes": {
        "task": "apps.photo.tasks.QRCodeRemoverTask",
        "schedule": crontab(minute='0', hour='*/48'),
    }
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS').split(', ')
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS').split(', ')
CORS_ALLOW_CREDENTIALS = True

CART_SESSION_ID = 'cart'

SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
SESSION_CACHE_ALIAS = 'default'
SESSION_COOKIE_NAME = 'sessionid'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

PHONENUMBER_DEFAULT_REGION = 'RU'

PHOTO_LINE_MEDIA_PATH = os.path.join(MEDIA_ROOT, 'photo_line')

TERMINAL_KEY = os.environ.get('TERMINAL_KEY')
T_PASSWORD = os.environ.get('T_PASSWORD')
PAYMENT_INIT_URL = os.environ.get('PAYMENT_INIT_URL')
PAYMENT_GET_STATE_URL = os.environ.get('PAYMENT_GET_STATE_URL')
TAXATION = os.environ.get('TAXATION')
VAT = os.environ.get('VAT')
