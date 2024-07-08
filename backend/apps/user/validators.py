import re

from django.core.exceptions import ValidationError


def validate_phone_number(phone_number):
    """
    Проверка российского номера телефона регулярным выражением.
    """
    pattern = re.compile('(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))')
    if not pattern.match(phone_number):
        raise ValidationError('Некорректный номер телефона.')
