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

COPY pyproject.toml pyproject.toml

RUN mkdir -p /opt/src/static/ && \
    mkdir -p /opt/src/media/ && \
    pip install --upgrade pip --index-url https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 && \
    pip install 'poetry>=1.4.2' --index-url https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --only main

COPY . .

EXPOSE 8000

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
