# Generated by Django 5.0.6 on 2024-07-08 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_alter_emailerrorlog_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(max_length=12, null=True, unique=True, verbose_name='Номер телефона'),
        ),
    ]
