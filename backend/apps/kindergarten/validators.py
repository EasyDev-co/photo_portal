from django.core.validators import RegexValidator

validate_cyrillic_space_dash = RegexValidator(
    regex=r'^[А-Яа-яЁё\s-]+$',
    message='Можно вводить только кириллические символы, пробелы и тире.'
)
validate_cyrillic_space_dash_quotes = RegexValidator(
    regex=r'^[А-Яа-яЁё\s/\'"-]+$',
    message='Можно вводить только кириллические символы, пробелы, тире и кавычки.'
)
