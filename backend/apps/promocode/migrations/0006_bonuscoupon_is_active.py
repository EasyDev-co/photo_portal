# Generated by Django 5.0.6 on 2024-07-03 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('promocode', '0005_alter_bonuscoupon_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='bonuscoupon',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
        ),
    ]
