# Generated by Django 5.0.8 on 2024-08-21 13:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0011_alter_order_photo_line_alter_order_status'),
        ('photo', '0009_alter_photoline_options_alter_phototheme_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Цена позиции'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='photo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='photo.photo', verbose_name='Фотография'),
        ),
    ]