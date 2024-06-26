# Generated by Django 5.0.2 on 2024-06-06 07:08

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Название региона')),
                ('ransom_amount', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Сумма выкупа')),
            ],
            options={
                'verbose_name': 'Регион',
                'verbose_name_plural': 'Регионы',
            },
        ),
        migrations.CreateModel(
            name='PhotoPrice',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Цена')),
                ('photo_type', models.CharField(choices=[('10x15', '10x15'), ('15x20', '15x20'), ('20x30', '20x30'), ('Магнит', 'Магнит'), ('Календарь', 'Календарь'), ('Фотокнига', 'Фотокнига')], default='10x15', max_length=10, verbose_name='Тип фотографии')),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='photo_prices', to='kindergarten.region', verbose_name='Регион')),
            ],
            options={
                'verbose_name': 'Цена фото',
                'verbose_name_plural': 'Цены фото',
            },
        ),
        migrations.CreateModel(
            name='Kindergarten',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, verbose_name='Название')),
                ('code', models.CharField(max_length=255, unique=True, verbose_name='Буквенный код')),
                ('qr_code', models.ImageField(blank=True, null=True, unique=True, upload_to='kindergarten/', verbose_name='QR код')),
                ('has_photobook', models.BooleanField(default=False, verbose_name='Наличие фотокниги')),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='kindergartens', to='kindergarten.region', verbose_name='Регион')),
            ],
            options={
                'verbose_name': 'Детский сад',
                'verbose_name_plural': 'Детские сады',
            },
        ),
    ]