# Generated by Django 5.0.2 on 2024-08-20 20:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0008_phototheme_are_qrs_removed'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='phototheme',
            options={'ordering': ('-created',), 'verbose_name': 'Тема фотосессии', 'verbose_name_plural': 'Темы фотосессий'},
        ),
    ]
