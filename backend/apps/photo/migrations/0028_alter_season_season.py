# Generated by Django 5.1.3 on 2024-11-23 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0027_remove_kindergartenphototheme_unique_active_photo_theme_per_kindergarten_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='season',
            name='season',
            field=models.CharField(max_length=50, verbose_name='Сезон'),
        ),
    ]
