# Generated by Django 5.0.6 on 2024-06-18 11:36

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('kindergarten', '0002_alter_photoprice_photo_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='PhotoTheme',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, verbose_name='Название')),
                ('is_active', models.BooleanField(verbose_name='Активно')),
                ('date_start', models.DateTimeField(verbose_name='Дата начала')),
                ('date_end', models.DateTimeField(verbose_name='Дата окончания')),
            ],
            options={
                'verbose_name': 'Тема фотосессии',
                'verbose_name_plural': 'Темы фотосессий',
            },
        ),
        migrations.CreateModel(
            name='PhotoLine',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('qr_code', models.ImageField(blank=True, null=True, unique=True, upload_to='photo_line/', verbose_name='QR код')),
                ('kindergarten', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='photo_lines', to='kindergarten.kindergarten', verbose_name='Детский сад')),
                ('photo_theme', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='photo_lines', to='photo.phototheme', verbose_name='Тема фотосессии')),
            ],
            options={
                'verbose_name': 'Линия фотографий',
                'verbose_name_plural': 'Линии фотографий',
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('number', models.PositiveIntegerField(unique=True, verbose_name='Номер')),
                ('photo', models.ImageField(upload_to='photo/', verbose_name='Фотография')),
                ('photo_line', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='photos', to='photo.photoline', verbose_name='Линия фотографий')),
            ],
            options={
                'verbose_name': 'Фотография',
                'verbose_name_plural': 'Фотографии',
            },
        ),
    ]
