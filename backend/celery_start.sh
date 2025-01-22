#! /usr/bin/env bash
set -e

python manage.py migrate --no-input
celery -A config.celery worker --loglevel=info --max-tasks-per-child=300 -P eventlet &
celery -A config.celery beat -S django --loglevel=info
