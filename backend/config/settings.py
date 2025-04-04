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

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:8001",
    "http://localhost:8080",
    "http://77.232.37.60:3000",
    "http://77.232.37.60:8000",
    "https://7c8a-188-234-12-6.ngrok-free.app",
    "https://7e9a-109-120-151-148.ngrok-free.app",
    "http://0.0.0.0:3000",
    "https://photodetstvo.ru",
    "http://0.0.0.0:8000",
    "https://stage.photodetstvo.ru",
    "http://0.0.0.0:8080",
    "http://172.18.0.4:3000",
    "http://0.0.0.0:3000",
    "https://upload.photodetstvo.ru:8081",
]

CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:8001",
    "http://localhost:8080",
    "http://77.232.37.60:3000",
    "http://77.232.37.60:8000",
    "http://0.0.0.0:3000",
    "https://7c8a-188-234-12-6.ngrok-free.app",
    "https://7e9a-109-120-151-148.ngrok-free.app",
    "https://photodetstvo.ru",
    "http://0.0.0.0:8000",
    "http://0.0.0.0:8080",
    "https://stage.photodetstvo.ru",
    "http://172.18.0.4:3000",
    "http://0.0.0.0:3000",
    "https://upload.photodetstvo.ru:8081",
]

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
    'auditlog',
    'yadisk',
    'dal',
    'dal_select2',

    # Приложения
    'apps.kindergarten',
    'apps.parent',
    'apps.photo',
    'apps.order',
    'apps.promocode',
    'apps.user',
    'apps.cart',
    'apps.oauth',

    # Приложения CRM
    'apps_crm.notifications',
    'apps_crm.roles',
    'apps_crm.registration',
    'apps_crm.history',
    'apps_crm.client_cards',
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
    'config.middleware.DependencyInjectorMiddleware',
    'auditlog.middleware.AuditlogMiddleware',
]

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'

SHOW_IN_ADMIN = False

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
        'OPTIONS': {
            'min_length': 6,
        },
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
    ),
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

REDIS_HOST = os.environ.get('REDIS_HOST')
REDIS_PORT = os.environ.get('REDIS_PORT')
REDIS_DB_CELERY = os.environ.get('REDIS_DB_CELERY')

CELERY_BROKER_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB_CELERY}'
CELERY_TIMEZONE = "Europe/Moscow"
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

CELERY_TASK_TIME_LIMIT = 240
CELERY_TASK_SOFT_TIME_LIMIT = 180

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
        "schedule": crontab(minute='0', hour='*/1'),
    },
    "check_if_orders_has_been_paid": {
        "task": "apps.order.tasks.CheckIfOrdersPaid",
        "schedule": crontab(minute='*/1'),
    },
    "delete_expired_orders": {
        "task": "apps.order.tasks.DeleteExpiredOrders",
        "schedule": crontab(minute='*/15'),
    },
    "update_photo_theme_activity": {
        "task": "apps.photo.tasks.UpdatePhotoThemeActivityTask",
        "schedule": crontab(minute='*/3'),
    },
    "calculate_ransom": {
        "task": "apps.kindergarten.tasks.CalculateRansomOfPastPhotoThemes",
        "schedule": crontab(minute='0', hour='*/4'),
    },
    "send_closing_receipts": {
        "task": "apps.order.tasks.SendClosingReceiptsTask",
        "schedule": crontab(minute='0', hour='*/1'),
    },
    "send_notify": {
        "task": "create_notify_for_expired_task",
        "schedule": crontab(minute='0', hour='*/1'),
    }
}

STATICFILES_DIRS = [
    BASE_DIR / 'apps/kindergarten/kinder_static',
]
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'apps/kindergarten/templates'],
        'APP_DIRS': True,  # Добавь, если его нет, для автоматического поиска шаблонов в приложениях.
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # Требуется для админки
                'django.contrib.auth.context_processors.auth',  # Требуется для админки
                'django.contrib.messages.context_processors.messages',  # Требуется для админки
            ],
        },
    },
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "SIGNING_KEY": os.environ.get('SIGNING_KEY'),
}

DJANGO_FILE_FORM_TUS_ENDPOINT = '/tus-upload/'

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
SEND_CLOSING_RECEIPT_URL = os.environ.get('SEND_CLOSING_RECEIPT_URL')
TAXATION = os.environ.get('TAXATION')
VAT = os.environ.get('VAT')
FFD_VERSION = os.environ.get('FFD_VERSION')
PAYMENT_OBJECT = os.environ.get('PAYMENT_OBJECT')
MEASUREMENT_UNIT = os.environ.get('MEASUREMENT_UNIT')

AUDITLOG_INCLUDE_ALL_MODELS = True
LOGO_PATH = os.environ.get('LOGO_PATH')

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/oauth/v1/callback/google/')

YANDEX_CLIENT_ID = os.environ.get('YANDEX_CLIENT_ID')
YANDEX_CLIENT_SECRET = os.environ.get('YANDEX_CLIENT_SECRET')
YANDEX_REDIRECT_URI = os.environ.get('YANDEX_REDIRECT_URI', 'http://localhost:8000/api/oauth/v1/callback/yandex/')

MAILRU_CLIENT_ID = os.environ.get('MAILRU_CLIENT_ID')
MAILRU_CLIENT_SECRET = os.environ.get('MAILRU_CLIENT_SECRET')
MAILRU_REDIRECT_URI = os.environ.get('MAILRU_REDIRECT_URI', 'http://localhost:8000/api/oauth/v1/callback/mailru/')

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
YC_BUCKET_NAME = os.environ.get("YC_BUCKET_NAME")
YC_REGION = os.environ.get("YC_REGION")
YC_S3_ENDPOINT = os.environ.get("YC_S3_ENDPOINT")

UPLOAD_URL = os.getenv('UPLOAD_URL')
JQUERY_CDN = os.getenv('JQUERY_CDN', 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')

YAD_OAUTH_TOKEN = os.getenv('YAD_OAUTH_TOKEN')
YAD_CLIENT_ID = os.getenv("YAD_CLIENT_ID")
YAD_CLIENT_SECRET = os.getenv("YAD_CLIENT_SECRET")
YAD_URL = os.getenv('YAD_URL')

UNISENER_TOKEN = os.getenv('UNISENER_TOKEN')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@photodetstvo.ru')

GALLERY_URL = "https://stage.photodetstvo.ru/gallery"
UPLOAD_SERVICE_SECRET_KEY = os.getenv('UPLOAD_SERVICE_SECRET_KEY')
GO_UPLOAD_URL = os.getenv('GO_UPLOAD_URL')

PRINTER_EMAIL = os.getenv('PRINTER_EMAIL')
LOGO_FOR_NOTIFICATION_PATH = os.getenv('LOGO_FOR_NOTIFICATION_PATH')
