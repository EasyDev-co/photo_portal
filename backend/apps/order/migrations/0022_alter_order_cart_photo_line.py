# Generated by Django 5.1.6 on 2025-03-05 18:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0015_cartphotoline_kindergarten_cartphotoline_user'),
        ('order', '0021_order_cart_photo_line'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='cart_photo_line',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cart_orders', to='cart.cartphotoline', verbose_name='Пробник в корзине'),
        ),
    ]
