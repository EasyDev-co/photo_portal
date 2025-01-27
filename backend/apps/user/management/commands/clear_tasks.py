from django.core.management.base import BaseCommand
from config.celery import app


class Command(BaseCommand):
    help = 'Clear all pending tasks in the Celery queue'

    def handle(self, *args, **options):
        discarded_count = app.control.discard_all()
        self.stdout.write(self.style.SUCCESS(f'Discarded {discarded_count} tasks'))