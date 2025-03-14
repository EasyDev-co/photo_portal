# Generated by Django 5.1.1 on 2024-09-23 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0010_alter_phototheme_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coefficient',
            name='photo_type',
            field=models.PositiveSmallIntegerField(choices=[(1, '10x15'), (2, '15x20'), (3, '20x30'), (4, 'Магнит'), (5, 'Календарь'), (6, 'Фотокнига'), (7, 'Календарь в подарок'), (0, 'Электронные фото')], verbose_name='Тип фотографии'),
        ),
    ]
