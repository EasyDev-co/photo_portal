#! /usr/bin/env bash
set -e

celery -A config.celery worker --loglevel=info &
celery -A config.celery beat -S django --loglevel=info
