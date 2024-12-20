# Generated by Django 5.0.6 on 2024-07-03 11:29

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0003_promocodephototypes'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='promocodephototypes',
            options={'verbose_name': 'Скидка к промокоду', 'verbose_name_plural': 'Скидки к промокодам'},
        ),
        migrations.CreateModel(
            name='BonusCoupon',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('balance', models.DecimalField(decimal_places=0, max_digits=10, verbose_name='Баланс купона')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bonus_coupons', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
