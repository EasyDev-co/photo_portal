import redis

from config import settings

class RedisClient:
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance.connection = redis.StrictRedis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB_CELERY,
                decode_responses=True
            )
        return cls._instance

    def get(self, key):
        """Получить значение по ключу"""
        try:
            return self.connection.get(key)
        except redis.RedisError as e:
            # Логируем ошибку или обрабатываем её
            raise e

    def set(self, key, value, ex=None):
        """
        Установить значение по ключу
        :param key: ключ
        :param value: значение
        :param ex: время жизни ключа (в секундах)
        """
        try:
            self.connection.set(key, value, ex=ex)
        except redis.RedisError as e:
            raise e

    def delete(self, key):
        """Удалить ключ"""
        try:
            self.connection.delete(key)
        except redis.RedisError as e:
            raise e

redis_client = RedisClient()
