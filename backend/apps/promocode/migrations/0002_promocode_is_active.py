# Generated by Django 5.0.6 on 2024-06-26 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocode',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
    ]
