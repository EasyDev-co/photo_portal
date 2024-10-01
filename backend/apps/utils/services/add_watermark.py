from PIL import Image

from config.settings import LOGO_PATH


def add_watermark(photo_path, opacity=192) -> Image:
    """
    Накладывает водяной знак на фотографию.
    """
    # Открываем фотографию и конвертируем в RGBA
    photo = Image.open(photo_path).convert("RGBA")

    width, height = photo.size

    # Открываем логотип и масштабируем до размеров фотографии
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = logo.resize((width, height))

    # Извлекаем альфа-канал и изменяем прозрачность
    logo = logo.copy()
    alpha = logo.split()[3]
    alpha = alpha.point(lambda p: p * opacity / 255)

    # Применяем изменённый альфа-канал обратно к логотипу
    logo.putalpha(alpha)

    # Накладываем водяной знак на фотографию
    photo.paste(logo, (0, 0), logo)

    photo = photo.convert("RGB")

    return photo
