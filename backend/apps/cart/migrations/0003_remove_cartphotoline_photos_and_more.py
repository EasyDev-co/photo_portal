# Generated by Django 5.0.7 on 2024-07-29 05:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_alter_photoincart_options_cartphotolinephotoincart_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartphotoline',
            name='photos',
        ),
        migrations.DeleteModel(
            name='CartPhotoLinePhotoInCart',
        ),
    ]