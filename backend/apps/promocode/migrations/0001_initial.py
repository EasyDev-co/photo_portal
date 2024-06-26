# Generated by Django 5.0.6 on 2024-06-24 14:59

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Promocode',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('code', models.CharField(max_length=200, verbose_name='Промокод')),
            ],
            options={
                'verbose_name': 'Промокод',
                'verbose_name_plural': 'Промокоды',
            },
        ),
    ]