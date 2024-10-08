# Generated by Django 5.1.1 on 2024-10-08 08:42

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('name', models.CharField(max_length=100, verbose_name='Название отдела')),
            ],
            options={
                'verbose_name': 'Отдел',
                'verbose_name_plural': 'Отделы',
            },
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('name', models.CharField(max_length=100, verbose_name='Название региона')),
            ],
            options={
                'verbose_name': 'Регион',
                'verbose_name_plural': 'Регионы',
            },
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('status', models.CharField(choices=[('active', 'Активный'), ('inactive', 'Неактивный')], max_length=50, verbose_name='Статус')),
                ('department', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.department', verbose_name='Отдел')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
                ('region', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.region', verbose_name='Регион')),
            ],
            options={
                'verbose_name': 'Сотрудник',
                'verbose_name_plural': 'Сотрудники',
            },
        ),
        migrations.CreateModel(
            name='ClientCard',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('client_name', models.CharField(max_length=100, verbose_name='Имя клиента')),
                ('responsible_manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.employee', verbose_name='Ответственный менеджер')),
            ],
            options={
                'verbose_name': 'Карточка клиента',
                'verbose_name_plural': 'Карточки клиентов',
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('name', models.CharField(max_length=100, verbose_name='Название роли')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='roles.department', verbose_name='Отдел')),
                ('parent_role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.role', verbose_name='Родительская роль')),
            ],
            options={
                'verbose_name': 'Роль',
                'verbose_name_plural': 'Роли',
            },
        ),
        migrations.AddField(
            model_name='employee',
            name='role',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='roles.role', verbose_name='Роль'),
        ),
    ]
