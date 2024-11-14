# Generated by Django 5.1.3 on 2024-11-14 11:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0014_alter_photoprice_region'),
        ('photo', '0025_alter_phototheme_season'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='phototheme',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='phototheme',
            name='kindergartens',
        ),
        migrations.CreateModel(
            name='KindergartenPhotoTheme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=False, verbose_name='Активно')),
                ('kindergarten', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='kindergartenphototheme', to='kindergarten.kindergarten', verbose_name='Детский сад')),
                ('photo_theme', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='kindergartenphototheme', to='photo.phototheme', verbose_name='Тема фото')),
            ],
            options={
                'verbose_name': 'Связь Детский сад - Фотосессия',
                'verbose_name_plural': 'Связи Детские сады - Фотосессии',
                'constraints': [models.UniqueConstraint(condition=models.Q(('is_active', True)), fields=('kindergarten',), name='unique_active_photo_theme_per_kindergarten')],
            },
        ),
    ]
