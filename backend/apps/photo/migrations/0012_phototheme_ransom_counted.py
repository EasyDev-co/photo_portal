# Generated by Django 5.1.1 on 2024-09-26 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0011_alter_coefficient_photo_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='phototheme',
            name='ransom_counted',
            field=models.BooleanField(default=False, verbose_name='Выкуп подсчитан'),
        ),
    ]
