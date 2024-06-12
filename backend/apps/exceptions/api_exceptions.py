from rest_framework.exceptions import APIException


class KindergartenCodeNotFound(APIException):
    status_code = 400
    default_detail = 'Такого детского сада не существует.'
    default_code = 'kindergarten_code_not_found'


class MissingKindergartenCode(APIException):
    status_code = 400
    default_detail = 'Код детского сада не указан.'
    default_code = 'missing_kindergarten_code'
