import re
import random
import string

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from transliterate import translit

from apps.kindergarten.models import Region, PhotoPrice, PhotoType, Kindergarten
from apps.promocode.models import Promocode
from apps.user.models import UserRole

User = get_user_model()


def generate_random_password(length=6):
    """Генерация случайного пароля из 6 символов (буквы и цифры)"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))


def transliterate_to_latin(text):
    """Транслитерация кириллицы в латиницу и очистка текста"""
    transliterated_text = translit(text, 'ru', reversed=True)
    slug_text = slugify(transliterated_text)
    result = slug_text.replace('-', '.')
    return result


@receiver(post_save, sender=Region)
def create_photoprice_for_region(sender, instance, created, **kwargs):
    """Сигнал для создания бесплатных айтемов для региона"""
    if created:
        PhotoPrice.objects.create(
            region=instance,
            photo_type=PhotoType.free_calendar
        )


@receiver(post_save, sender=Kindergarten)
def create_kindergarten_manager(sender, instance, created, **kwargs):
    """Сигнал для создания ЛК заведующей"""
    if created:
        # Генерируем email из имени детского сада
        email_local_part = transliterate_to_latin(instance.name)
        email = f"{email_local_part}@photodetstvo.ru"

        # Создаем случайный пароль
        random_password = generate_random_password()
        hashed_password = make_password(random_password)

        with transaction.atomic():
            # Создаем пользователя-заведующую
            manager = User.objects.create(
                email=email,
                first_name="Фото",
                second_name="Детство",
                last_name="ФотоДетство",
                role=UserRole.manager,
                is_verified=True,
                un_hashed_password=random_password,
                password=hashed_password,
                managed_kindergarten=instance
            )

            # Создаем промокод для заведующего без указания фотосессии
            Promocode.objects.create(
                user=manager,
                code=Promocode.generate_unique_code()
            )
