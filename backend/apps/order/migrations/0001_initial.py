# Generated by Django 5.0.6 on 2024-06-24 15:54

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('kindergarten', '0002_alter_photoprice_photo_type'),
        ('photo', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('order_price', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Цена заказа')),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Создан'), (2, 'Оплачен')], default=1, verbose_name='Статус заказа')),
                ('kindergarten', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='orders', to='kindergarten.kindergarten', verbose_name='Детский сад')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Заказ',
                'verbose_name_plural': 'Заказы',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('photo_type', models.PositiveSmallIntegerField(choices=[(1, '10x15'), (2, '15x20'), (3, '20x30'), (4, 'Магнит'), (5, 'Календарь')], default=3, verbose_name='Тип фото')),
                ('is_digital', models.BooleanField(default=False, verbose_name='В электронном виде')),
                ('amount', models.PositiveIntegerField(default=1, verbose_name='Количество')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='order.order', verbose_name='Заказ')),
                ('photo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='photo.photo', verbose_name='Фотография')),
            ],
            options={
                'verbose_name': 'Часть заказа',
                'verbose_name_plural': 'Части заказа',
            },
        ),
    ]
