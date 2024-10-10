import string
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model

from apps_crm.roles.models import Employee, Role, Region
from apps_crm.registration.tasks import send_user_credentials


User = get_user_model()


class UserService:
    @staticmethod
    def create_user(first_name, last_name, email, role_name, region_name, logged_in_user_id):

        if User.objects.filter(email=email).exists():
            raise ValueError(f"Пользователь с email '{email}' уже существует.")
        # Генерация логина и пароля
        password = get_random_string(
            length=8, allowed_chars=string.ascii_letters + string.digits
        )

        # Создание пользователя
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            role=3,
        )
        user.set_password(password)
        user.save()

        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            return ValueError(f"Роль '{role_name}' не найдена.")

        try:
            region = Region.objects.get(name=region_name)
        except Region.DoesNotExist:
            raise ValueError(f"Регион с именем '{region_name}' не найден.")

        # Создание связанного сотрудника
        Employee.objects.create(
            user=user,
            role=role,
            region=region,
            status='active'
        )

        send_user_credentials.delay(
            user_id=logged_in_user_id,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        return user
