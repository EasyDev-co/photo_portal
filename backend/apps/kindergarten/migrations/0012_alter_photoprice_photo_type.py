# Generated by Django 5.1.1 on 2024-09-23 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0011_remove_region_ransom_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photoprice',
            name='photo_type',
            field=models.PositiveSmallIntegerField(choices=[(1, '10x15'), (2, '15x20'), (3, '20x30'), (4, 'Магнит'), (5, 'Календарь'), (6, 'Фотокнига'), (7, 'Календарь в подарок'), (0, 'Электронные фото')], default=1, verbose_name='Тип фотографии'),
        ),
    ]
