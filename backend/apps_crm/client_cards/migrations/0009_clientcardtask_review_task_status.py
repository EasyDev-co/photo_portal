# Generated by Django 5.1.3 on 2024-11-11 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('client_cards', '0008_clientcardtask_executor_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientcardtask',
            name='review_task_status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Доработать'), (2, 'Провалить'), (3, 'Принять')], default=3, verbose_name='Статус ревью'),
        ),
    ]
