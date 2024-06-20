from io import BytesIO
from urllib.parse import urlencode

import qrcode


def generate_qr_code(url: str, photo_line_id: str = None, kindergarten_code: str = None, photo_numbers: list = None):
    """
    Генерация QR кода на основе url.
    """
    full_url = url
    params = []

    if photo_line_id:
        params.append(('photo_line_id', photo_line_id))
    if kindergarten_code:
        params.append(('kindergarten_code', kindergarten_code))
    if photo_numbers:
        params.extend(('photo', photo_num) for photo_num in photo_numbers)

    query_string = urlencode(params)
    full_url += f'{query_string}'

    qr_code = qrcode.make(full_url)

    buffer = BytesIO()
    qr_code.save(buffer, format='PNG')
    buffer.seek(0)

    return qr_code, buffer
