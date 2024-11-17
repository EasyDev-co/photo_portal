FROM python:3.11

# Настройки окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV UWSGI_PROCESSES 4
ENV UWSGI_THREADS 8
ENV UWSGI_HARAKIRI 60
ENV DJANGO_SETTINGS_MODULE 'config.settings'

WORKDIR /opt/backend

RUN mkdir -p /opt/src/static/ && \
    mkdir -p /opt/src/media/ && \
    pip install --upgrade pip --index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
    pip install 'poetry>=1.4.2' --index-url https://pypi.tuna.tsinghua.edu.cn/simple

RUN poetry config virtualenvs.create false && \
    poetry config pypi-repositories.tuna.url https://pypi.tuna.tsinghua.edu.cn/simple && \
    poetry install --no-root --only main

COPY . .

RUN chmod +x /celery_start.sh

ENTRYPOINT ["/celery_start.sh"]
