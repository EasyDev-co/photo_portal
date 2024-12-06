import os
import time
import requests

# Конфигурация
UPLOAD_URL = " https://60ae-45-76-88-92.ngrok-free.app/v1/files/upload/"
PHOTO_DIR = "photo_dir300"  # Замените на путь к вашей директории с фото
MAX_FILE_SIZE_MB = 10  # Максимальный размер одного файла в MB


def upload_photos(photo_files):
    """Загружает все фото за один запрос."""
    try:
        files = [("files", (os.path.basename(photo), open(photo, "rb"))) for photo in photo_files]

        response = requests.post(
            UPLOAD_URL,
            files=files,
            params={"kindergarten": "Лепесток", "photo_theme": "Мизинчик", "region": "Сывтывкар"}
        )
        return response.status_code, response.text, response.json()
    except Exception as e:
        return None, str(e)


def main():
    # Проверяем наличие директории
    if not os.path.exists(PHOTO_DIR):
        print(f"Error: Directory '{PHOTO_DIR}' does not exist.")
        return

    photo_files = [
        os.path.join(PHOTO_DIR, file)
        for file in os.listdir(PHOTO_DIR)
        if os.path.isfile(os.path.join(PHOTO_DIR, file))
    ]

    print(f"Found {len(photo_files)} files in '{PHOTO_DIR}'")

    # Фильтруем файлы по размеру
    valid_photo_files = [
        photo for photo in photo_files
        if os.path.getsize(photo) / (1024 * 1024) <= MAX_FILE_SIZE_MB
    ]

    if not valid_photo_files:
        print("No valid files to upload. All files exceed the size limit.")
        return

    print(f"Uploading {len(valid_photo_files)} valid files...")

    start_time = time.time()

    status_code, response_text, response = upload_photos(valid_photo_files)
    elapsed_time = time.time() - start_time

    if status_code == 200:
        print(f"response: {response}")
        print(f"Successfully uploaded files in {elapsed_time:.2f} seconds.")
    else:
        print(f"Failed to upload files. Status code: {status_code}, Response: {response_text}")


if __name__ == "__main__":
    main()
