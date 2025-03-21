# Generated by Django 5.1.2 on 2024-11-05 10:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0013_alter_photoprice_region'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photoprice',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='photo_prices', to='kindergarten.region', verbose_name='Регион'),
        ),
    ]
