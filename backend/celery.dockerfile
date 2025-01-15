# Используем базовый образ Python 3.11
FROM python:3.11

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UWSGI_PROCESSES=4
ENV UWSGI_THREADS=8
ENV UWSGI_HARAKIRI=60
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV POETRY_REPOSITORIES_TUNA_URL=https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /opt/backend

# Копируем файл зависимостей
COPY pyproject.toml pyproject.toml

# Создаем необходимые директории и устанавливаем зависимости
RUN mkdir -p /opt/src/static/ && \
    mkdir -p /opt/src/media/ && \
    pip install --upgrade pip --index-url https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 && \
    pip install poetry==2.0.1 --index-url https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 && \
    poetry config repositories.tuna ${POETRY_REPOSITORIES_TUNA_URL} && \
    poetry config installer.parallel false && \
    poetry install --no-root --only main

# Копируем весь проект
COPY . .

# Копируем и устанавливаем права для скрипта запуска Celery
COPY celery_start.sh /celery_start.sh
RUN chmod +x /celery_start.sh

# Указываем точку входа
ENTRYPOINT ["/celery_start.sh"]
