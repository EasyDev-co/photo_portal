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

if not settings.SHOW_IN_ADMIN:
    try:
        admin.site.unregister(LogEntry)
    except admin.sites.NotRegistered:
        pass

    for model in models_to_unregister_celery:
        try:
            admin.site.unregister(model)
        except admin.sites.NotRegistered:
            pass
