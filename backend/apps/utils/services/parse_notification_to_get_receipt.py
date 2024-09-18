from rest_framework.exceptions import ValidationError
from apps.utils.services.generate_token_for_t_bank import generate_token_for_t_bank


class ParseNotificationToGetReceipt:
    """Парсинг нотификации для получения чека с проверкой токена."""
    def __init__(self, notification: dict):
        self.notification = notification

    def _validate_token(self) -> bool:
        return self.notification['Token'] == generate_token_for_t_bank(self.notification)

    def parse_notification(self) -> dict | None:
        if self._validate_token():
            parsed_data = {
                'receipt': self.notification['Url'],
                'orders_payment_id': self.notification['OrderId']
            }
            return parsed_data
        raise ValidationError(detail="Невалидный токен.", code='invalid_token')
