# Generated by Django 5.0.6 on 2024-07-03 11:01

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0002_promocode_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='PromocodePhotoTypes',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('photo_type', models.PositiveSmallIntegerField(blank=True, choices=[(1, '10x15'), (2, '15x20'), (3, '20x30'), (4, 'Магнит'), (5, 'Календарь'), (6, 'Фотокнига')], verbose_name='Тип фото, к которой применяется скидка')),
                ('discount', models.DecimalField(decimal_places=0, max_digits=3, verbose_name='Размер скидки (%)')),
                ('promocode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='promocode_phototype', to='promocode.promocode', verbose_name='Промокод')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]