# Generated by Django 5.0.7 on 2024-08-06 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0007_userphotocount'),
    ]

    operations = [
        migrations.AddField(
            model_name='phototheme',
            name='are_qrs_removed',
            field=models.BooleanField(default=False, verbose_name='Удалены ли QR коды'),
        ),
    ]