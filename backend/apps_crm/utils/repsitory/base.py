from django.db.models import Model
from typing import Type, TypeVar, Generic

T = TypeVar('T', bound=Model)


class BaseRepository(Generic[T]):
    """Базовый репозиторий"""

    def __init__(self, model: Type[T]) -> None:
        self._model = model

    def get_obj(self, **kwargs) -> T:
        """Получение одного объекта по параметрам"""
        return self._model.objects.filter(**kwargs).first()

    def list(self, **kwargs):
        """Получение списка объектов по параметрам"""
        return self._model.objects.filter(**kwargs)

    def create_obj(self, **kwargs) -> T:
        """Создание нового объекта"""
        return self._model.objects.create(**kwargs)

    def update_obj(self, instance: T, **kwargs) -> T:
        """Обновление существующего объекта"""
        for field, value in kwargs.items():
            setattr(instance, field, value)
        instance.save()
        return instance