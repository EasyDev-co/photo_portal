# Generated by Django 5.1.2 on 2024-11-06 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0014_alter_photoprice_region'),
        ('photo', '0021_alter_photo_photo_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='phototheme',
            name='kindergarten',
        ),
        migrations.AddField(
            model_name='phototheme',
            name='kindergartens',
            field=models.ManyToManyField(blank=True, null=True, related_name='photo_themes', to='kindergarten.kindergarten', verbose_name='Детский сад'),
        ),
    ]
