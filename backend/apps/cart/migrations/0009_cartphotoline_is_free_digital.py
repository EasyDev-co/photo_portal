# Generated by Django 5.1.4 on 2024-12-14 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0008_alter_photoincart_photo_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartphotoline',
            name='is_free_digital',
            field=models.BooleanField(default=False, verbose_name='Бесплатные электронные фотографии'),
        ),
    ]
