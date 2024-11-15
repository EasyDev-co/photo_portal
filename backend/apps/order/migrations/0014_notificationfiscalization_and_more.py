# Generated by Django 5.1.1 on 2024-09-13 12:21

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0010_alter_kindergarten_name'),
        ('order', '0013_orderspayment_order_order_payment'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='NotificationFiscalization',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('notification', models.JSONField()),
                ('was_processed', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Нотификация о фискализации',
                'verbose_name_plural': 'Нотификации о фискализации',
            },
        ),
        migrations.AddField(
            model_name='orderspayment',
            name='is_closing_receipt_sent',
            field=models.BooleanField(default=False, verbose_name='Отправлен закрывающий чек'),
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('receipt_url', models.URLField(blank=True, null=True, verbose_name='Ссылка на чек')),
                ('kindergarten', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receipts', to='kindergarten.kindergarten', verbose_name='Детский сад')),
                ('orders_payment', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='receipts', to='order.orderspayment', verbose_name='Заказы')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='receipts', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Чек',
                'verbose_name_plural': 'Чеки',
            },
        ),
    ]
