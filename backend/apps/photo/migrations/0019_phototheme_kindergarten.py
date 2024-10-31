# Generated by Django 5.1.2 on 2024-10-31 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0013_alter_photoprice_region'),
        ('photo', '0018_alter_phototheme_season'),
    ]

    operations = [
        migrations.AddField(
            model_name='phototheme',
            name='kindergarten',
            field=models.ManyToManyField(blank=True, null=True, related_name='kindergartens', to='kindergarten.kindergarten', verbose_name='Детский сад'),
        ),
    ]
