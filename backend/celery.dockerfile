FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /opt/backend

COPY pyproject.toml pyproject.toml

RUN pip install --upgrade pip && \
    pip install 'poetry>=1.4.2' && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --only main

COPY . .

CMD ["bash"]
