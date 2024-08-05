from django.core.validators import RegexValidator

validate_cyrillic = RegexValidator(
    regex=r'^[А-Яа-яЁё]+$',
    message='Можно вводить только кириллические символы.'
)
