# Generated by Django 5.0.6 on 2024-07-03 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0002_alter_orderitem_photo_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='id',
            field=models.CharField(editable=False, max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='order',
            name='id',
            field=models.AutoField(editable=False, primary_key=True, serialize=False, verbose_name="Номер заказа"),
        ),
    ]
