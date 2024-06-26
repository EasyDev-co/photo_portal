# Generated by Django 5.0.6 on 2024-06-25 20:39

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_alter_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]