from PIL import Image

from config.settings import LOGO_PATH


def add_watermark(photo, opacity=192) -> Image.Image:
    """
    Накладывает водяной знак на фотографию.
    """
    # Предполагается, что photo уже является объектом Image.Image
    if not isinstance(photo, Image.Image):
        raise TypeError("Параметр 'photo' должен быть объектом PIL.Image.Image")

    # Конвертируем изображение в RGBA, если оно еще не в этом формате
    if photo.mode != "RGBA":
        photo = photo.convert("RGBA")

    width, height = photo.size

    # Открываем логотип и масштабируем до размеров фотографии
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = logo.resize((width, height))

    # Извлекаем альфа-канал и изменяем прозрачность
    alpha = logo.split()[3]
    alpha = alpha.point(lambda p: p * opacity / 255)

    # Применяем изменённый альфа-канал обратно к логотипу
    logo.putalpha(alpha)

    # Накладываем водяной знак на фотографию
    watermarked_photo = photo.copy()
    watermarked_photo.paste(logo, (0, 0), logo)

    # Конвертируем обратно в RGB перед сохранением
    watermarked_photo = watermarked_photo.convert("RGB")

    return watermarked_photo
