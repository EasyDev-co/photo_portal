from django.apps import AppConfig


class ClientCardsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps_crm.client_cards'

    def ready(self):
        import apps_crm.client_cards.signals
