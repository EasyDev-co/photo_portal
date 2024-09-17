import hashlib

from config.settings import T_PASSWORD


def format_value(value):
    """
    Преобразование булевых значений в строку 'true' или 'false', остальные значения просто в строку
    """
    return str(value).lower() if isinstance(value, bool) else str(value)


def generate_token_for_t_bank(values: dict) -> str:
    """
    Шифрование данных для создания подписи запроса согласно документации Т-банка.
    """

    # удаляем Receipt, DATA, Token если они есть
    for key in ['Receipt', 'DATA', 'Token']:
        values.pop(key, None)

    # добавляем пароль
    values['Password'] = T_PASSWORD

    # сортируем словарь после добавления пароля
    sorted_parameters = dict(sorted(values.items()))

    # конкатенируем значения всех пар
    concatenated_values = ''.join([
        format_value(value) for value in sorted_parameters.values() if value is not None
    ])

    # вычисляем SHA-256
    hash_object = hashlib.sha256(concatenated_values.encode('utf-8'))
    return hash_object.hexdigest()
