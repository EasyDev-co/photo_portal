#!/bin/bash

python manage.py collectstatic --no-input
python manage.py migrate --no-input
python manage.py runserver 0:8000 # Использовать только для локальной разработке. Для прода используем gunicorn

# gunicorn config.wsgi:application -w 4 --bind 0.0.0.0:8000 --log-level warning