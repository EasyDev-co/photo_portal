# Generated by Django 5.1.5 on 2025-02-02 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0010_alter_photoincart_photo'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cartphotoline',
            options={'ordering': ('-created_at',), 'verbose_name': 'Пробник в корзине', 'verbose_name_plural': 'Пробники в корзине'},
        ),
        migrations.AddField(
            model_name='cartphotoline',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='Дата создания'),
        ),
    ]
