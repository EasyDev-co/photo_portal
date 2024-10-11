from django.contrib.auth import get_user_model

User = get_user_model()


def create_or_get_user(email, first_name=None, last_name=None):
    """
    Функция для создания пользователя или получения существующего.
    """
    user, created = User.objects.get_or_create(email=email, defaults={
        'first_name': first_name,
        'last_name': last_name,
    })
    return user, created
