from django.apps import AppConfig


class HistoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps_crm.history'
    verbose_name = 'История изменений'

    def ready(self):
        import apps_crm.history.signals  # noqa
