# Generated by Django 5.0.7 on 2024-07-26 12:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0004_region_country'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='region',
            options={'ordering': ['name'], 'verbose_name': 'Регион', 'verbose_name_plural': 'Регионы'},
        ),
    ]
