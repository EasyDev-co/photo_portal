# Generated by Django 5.1.4 on 2025-01-13 10:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0032_remove_phototheme_season_photothemename_season'),
    ]

    operations = [
        migrations.AddField(
            model_name='kindergartenphototheme',
            name='ya_disk_link',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Ссылка на ЯДиск'),
        ),
    ]
