import uuid
import logging

from django.db import models
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)


class UUIDMixin(models.Model):
    """UUID mixin"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampedMixin(models.Model):
    """Create update date mixin"""
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Создан"))
    modified = models.DateTimeField(auto_now=True, verbose_name=_("Изменен"))

    class Meta:
        abstract = True


class SingletonModelMixin(models.Model):
    """Mixin для создания одной модели"""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.pk and self.__class__.objects.exists():
            logger.error(f"Попытка сохранения второй записи {self.__class__.__name__}.")
            return
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        logger.error("Удаление объекта не разрешено.")

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
