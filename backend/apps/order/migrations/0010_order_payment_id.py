# Generated by Django 5.0.8 on 2024-08-15 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0009_alter_order_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_id',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Идентификатор транзакции'),
        ),
    ]
