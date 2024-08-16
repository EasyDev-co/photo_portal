import hashlib


def generate_token_for_t_bank(values: dict) -> str:
    """
    Шифрование данных для создания подписи запроса согласно документации Т-банка.
    """
    sorted_values = dict(sorted(values.items()))
    concatenated_values = ''.join([str(value) for value in (sorted_values.values())])
    hash_object = hashlib.sha256(concatenated_values.encode('utf-8'))
    return hash_object.hexdigest()
