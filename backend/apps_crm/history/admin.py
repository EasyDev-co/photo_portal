from django.contrib import admin
from django.conf import settings
from django_celery_beat.models import (
    PeriodicTask,
    IntervalSchedule,
    CrontabSchedule,
    SolarSchedule,
    ClockedSchedule,
    PeriodicTasks,
)

from auditlog.models import LogEntry

models_to_unregister_celery = [
        PeriodicTask,
        IntervalSchedule,
        CrontabSchedule,
        SolarSchedule,
        ClockedSchedule,
        PeriodicTasks,
    ]

# admin.site.register(LogEntry)

if not settings.SHOW_IN_ADMIN:
    for model in models_to_unregister_celery:
        try:
            admin.site.unregister(model)
        except admin.sites.NotRegistered:
            pass
