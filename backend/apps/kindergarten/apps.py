from django.apps import AppConfig


class KindergartenConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.kindergarten'

    def ready(self):
        import apps.kindergarten.signals  # noqa
