from django.core.validators import RegexValidator

# Проверка российского номера телефона регулярным выражением.
validate_phone_number = RegexValidator(
    regex=r'(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))',
    message='Некорректный номер телефона.'
)

validate_cyrillic = RegexValidator(
    regex=r'^[А-Яа-яЁё]+$',
    message='Можно вводить только кириллические символы.'
)
