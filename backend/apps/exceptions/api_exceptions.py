from rest_framework.exceptions import APIException


class KindergartenCodeNotFound(APIException):
    status_code = 400
    default_detail = 'Такого детского сада не существует.'
    default_code = 'kindergarten_code_not_found'


class MissingKindergartenCode(APIException):
    status_code = 400
    default_detail = 'Код детского сада не указан.'
    default_code = 'missing_kindergarten_code'


class UserNotFound(APIException):
    status_code = 400
    default_detail = 'Пользователь с таким адресом электронной почты не найден.'
    default_code = 'user_not_found'


class UserRegistered(APIException):
    status_code = 400
    default_detail = "Пользователь с таким email уже зарегистрирован"
    default_code = 'user_registered'


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
    default_detail = 'Такая фотосессия не найдена.'
    default_code = 'photo_theme_not_found'
