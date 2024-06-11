from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.user.managers import UserManager


class User(AbstractUser):
    ROLE = (
        ('parent', 'Родитель'),
    )

    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255, verbose_name='Имя')
    second_name = models.CharField(max_length=255, verbose_name='Отчество', blank=True)
    last_name = models.CharField(max_length=255, verbose_name='Фамилия')

    role = models.CharField(max_length=7, choices=ROLE, default='parent')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.second_name} {self.last_name}"
