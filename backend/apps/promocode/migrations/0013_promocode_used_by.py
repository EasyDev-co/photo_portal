# Generated by Django 5.1.3 on 2024-11-28 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0012_alter_promocode_photo_theme'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocode',
            name='used_by',
            field=models.JSONField(blank=True, default=list, null=True, verbose_name='Кем использован'),
        ),
    ]