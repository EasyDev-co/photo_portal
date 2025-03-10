# Generated by Django 5.1.4 on 2024-12-07 14:02

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0022_user_un_hashed_password_alter_user_kindergarten'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='second_name',
            field=models.CharField(blank=True, max_length=56, null=True, validators=[django.core.validators.MinLengthValidator(2), django.core.validators.RegexValidator(message='Можно вводить только кириллические символы.', regex='^[А-Яа-яЁё]+$')], verbose_name='Отчество'),
        ),
    ]
