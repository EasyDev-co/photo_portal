from django import template

from loguru import logger

register = template.Library()

@register.filter
def get_item(dictionary, key):
    """Возвращает dictionary[key], если ключ есть, иначе None."""
    return dictionary.get(key)
