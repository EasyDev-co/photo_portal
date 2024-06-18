from io import BytesIO

import qrcode


def generate_qr_code(url: str):
    """
    Генерация QR кода на основе url.
    """
    qr_code = qrcode.make(url)

    buffer = BytesIO()
    qr_code.save(buffer, format='PNG')
    buffer.seek(0)

    return qr_code, buffer
