import re


def normalize_phone_number(phone_number):
    """
    Метод для приведения телефонного номера к международному формату.
    """
    digits_only = re.sub(r'\D', '', phone_number)

    if digits_only.startswith('8'):
        digits_only = '7' + digits_only[1:]

    if len(digits_only) != 11 or not digits_only.startswith('7'):
        return None

    normalized_number = '+' + digits_only

    return normalized_number
