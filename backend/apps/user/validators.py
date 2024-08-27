import re

from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

validate_cyrillic = RegexValidator(
    regex=r'^[А-Яа-яЁё]+$',
    message='Можно вводить только кириллические символы.'
)


class CustomPasswordValidator:
    """
    Кастомный валидатор пароля.
    """

    message = (
        "Пароль может содержать только латинские буквы, цифры "
        "и спецсимволы ~!@#$%^&*()_-+=."
    )

    def validate(self, password, user=None):
        if not re.match(r'^[a-zA-Z0-9~!@#$%^&*()_\-+=]+$', password):
            raise ValidationError(self.message)

    def get_help_text(self):
        return self.message
