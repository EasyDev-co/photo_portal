from django.apps import AppConfig


class PhotoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.photo'
    verbose_name = "Фотографии"

    def ready(self):
        import apps.photo.signals  # noqa