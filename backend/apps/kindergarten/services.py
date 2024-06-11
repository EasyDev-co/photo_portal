import qrcode

from config.settings import REGISTRATION_URL_FOR_PARENT


def generate_qr_code(code: str):
    """
    Генерация QR кода на основе буквенного кода детского сада.
    """
    url = f'{REGISTRATION_URL_FOR_PARENT}{code}'
    qr_code = qrcode.make(url)
    return qr_code
