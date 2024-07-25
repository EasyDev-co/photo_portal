from rest_framework.exceptions import APIException


class KindergartenCodeNotFound(APIException):
    status_code = 400
    default_detail = 'Такого детского сада не существует.'
    default_code = 'kindergarten_code_not_found'


class MissingKindergartenCode(APIException):
    status_code = 400
    default_detail = 'Код детского сада не указан.'
    default_code = 'missing_kindergarten_code'


class ParentNotFound(APIException):
    status_code = 400
    default_detail = 'Родитель с таким адресом электронной почты не найден.'
    default_code = 'parent_not_found'


class InvalidCode(APIException):
    status_code = 400
    default_detail = 'Неверный код или истек срок его действия.'
    default_code = 'invalid_code'


class PhotoPriceDoesNotExist(APIException):
    status_code = 400
    default_detail = 'Цена на фото этого типа не найдена.'
    default_code = 'photo_price_not_found'


class PhotoThemeDoesNotExist(APIException):
    status_code = 400
    default_detail = 'Такая фототема не найдена.'
    default_code = 'photo_theme_not_found'
