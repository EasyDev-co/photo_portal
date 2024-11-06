# Generated by Django 5.1.3 on 2024-11-06 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0020_alter_managerbonus_photo_theme'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='manager_discount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=3, verbose_name='Скидка заведующей'),
        ),
        migrations.AddField(
            model_name='user',
            name='manager_percent',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=3, verbose_name='Процент заведующей'),
        ),
    ]
