# Generated by Django 5.1.2 on 2024-10-28 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0018_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='birth_date',
            field=models.DateField(blank=True, null=True, verbose_name='День рождения'),
        ),
    ]