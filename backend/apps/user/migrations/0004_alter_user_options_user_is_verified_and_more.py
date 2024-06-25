# Generated by Django 5.0.6 on 2024-06-25 12:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kindergarten', '0002_alter_photoprice_photo_type'),
        ('promocode', '0001_initial'),
        ('user', '0003_alter_user_role'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Пользователь', 'verbose_name_plural': 'Пользователи'},
        ),
        migrations.AddField(
            model_name='user',
            name='is_verified',
            field=models.BooleanField(default=False, verbose_name='Подтверждение email'),
        ),
        migrations.AddField(
            model_name='user',
            name='kindergarten',
            field=models.ManyToManyField(related_name='users', to='kindergarten.kindergarten', verbose_name='Детский сад'),
        ),
        migrations.AddField(
            model_name='user',
            name='promocode',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='promocode.promocode', verbose_name='Промокод'),
        ),
    ]
