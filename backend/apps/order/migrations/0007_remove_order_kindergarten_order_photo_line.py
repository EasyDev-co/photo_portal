# Generated by Django 5.0.7 on 2024-07-17 18:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0006_order_is_photobook'),
        ('photo', '0003_photoline_parent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='kindergarten',
        ),
        migrations.AddField(
            model_name='order',
            name='photo_line',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='orders', to='photo.photoline', verbose_name='Фотолиния'),
        ),
    ]
