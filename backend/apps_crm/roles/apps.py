from django.apps import AppConfig


class RolesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps_crm.roles'

    def ready(self):
        import apps_crm.roles.signals
