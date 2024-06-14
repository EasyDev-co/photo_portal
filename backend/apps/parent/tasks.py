from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction

from apps.parent.models import ConfirmCode, Parent
from apps.parent.models.code import CodePurpose
from apps.parent.models.send_email_error import SendEmailError
from apps.user.models import User
from config.settings import EMAIL_HOST_USER


@shared_task(name='send_confirm_code')
def send_confirm_code(user_id, code_purpose, *args, **kwargs):
    user: User = User.objects.get(id=user_id)
    code = default_token_generator.make_token(user)
    parent = Parent.objects.get(user=user)

    if code_purpose == CodePurpose.RESET_PASSWORD:
        subject = 'Восстановление пароля'
        message = 'Код восстановления пароля:\n'
    elif code_purpose == CodePurpose.CONFIRM_EMAIL:
        subject = 'Подтверждение почты'
        message = 'Код для подтверждения почты:\n'
    else:
        raise ValueError('Неизвестный code_purpose.')

    with transaction.atomic():
        ConfirmCode.objects.filter(
            parent=parent,
            purpose=code_purpose,
            is_used=False
        ).update(is_used=True)

        confirm_code = ConfirmCode.objects.create(
            parent=parent,
            code=code,
            purpose=code_purpose,
        )

    try:
        send_mail(
            subject=subject,
            message=message + code,
            from_email=EMAIL_HOST_USER,
            recipient_list=(user.email,),
            fail_silently=False,
        )
    except Exception as e:
        SendEmailError.objects.create(
            confirm_code=confirm_code,
            message=e,
            is_sent=False
        )


@shared_task
def resend_code():
    send_email_errors = SendEmailError.objects.filter(
        confirm_code__is_used=False,
        is_sent=False
    )
    for send_email_error in send_email_errors:
        send_confirm_code.delay(
            user_id=send_email_error.confirm_code.parent.user.id,
            code_purpose=send_email_error.confirm_code.purpose
        )
    send_email_errors.update(is_sent=True)
