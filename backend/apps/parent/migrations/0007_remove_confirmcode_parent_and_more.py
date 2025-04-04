# Generated by Django 5.0.6 on 2024-06-25 12:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parent', '0006_emailerrorlog_delete_sendemailerror'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='confirmcode',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='emailerrorlog',
            name='parent',
        ),
        migrations.AddField(
            model_name='confirmcode',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='emailerrorlog',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Родитель'),
            preserve_default=False,
        ),
    ]
