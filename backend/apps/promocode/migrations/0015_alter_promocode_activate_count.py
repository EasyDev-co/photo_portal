# Generated by Django 5.1.7 on 2025-03-23 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0014_alter_promocode_activate_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='promocode',
            name='activate_count',
            field=models.IntegerField(default=8, verbose_name='Кол-во активаций промо кода'),
        ),
    ]
