# Generated by Django 5.0.8 on 2024-08-20 10:36

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0009_alter_kindergarten_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kindergarten',
            name='name',
            field=models.CharField(max_length=56, validators=[django.core.validators.RegexValidator(message='Можно вводить только цифры, кириллические символы, пробелы, знак номера (№), тире и кавычки.', regex='^[0-9А-Яа-яЁё\\s/\\\'"№-]+$'), django.core.validators.MinLengthValidator(2)], verbose_name='Название'),
        ),
    ]
