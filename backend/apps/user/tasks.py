import secrets

from unisender_go_api import SyncClient, SendRequest
from django.contrib.auth import get_user_model
from django.db import transaction

from apps.user.models import ConfirmCode
from apps.user.models.code import CodePurpose
from apps.user.models.email_error_log import EmailErrorLog

from config.celery import BaseTask, app
from config.settings import UNISENER_TOKEN, FROM_EMAIL

from loguru import logger

User = get_user_model()

html_msg = """
                       <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                           <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
                               <h1 style="margin: 0; color: #000;">ФотоДетство</h1>
                           </div>
                           <div style="background-color: #f9f9f9; padding: 30px; text-align: center;">
                               <p style="font-size: 18px; color: #333;">{message}</p>
                               <div style="display: inline-block; background-color: #e0e0e0; padding: 20px 40px; border-radius: 5px;">
                                   <span style="font-size: 24px; font-weight: bold; color: #000;">{code}</span>
                               </div>
                           </div>
                       </div>
                       """


class SendConfirmCodeTask(BaseTask):
    name = "send_confirm_code"

    def process(self, confirm_code_id, *args, **kwargs):
        logger.info("send confirm code")

        confirm_code = ConfirmCode.objects.get(id=confirm_code_id)
        user = confirm_code.user
        code_purpose = confirm_code.purpose
        code = confirm_code.code

        if code_purpose == CodePurpose.RESET_PASSWORD:
            message = 'Код для сброса пароля:'
        elif code_purpose == CodePurpose.CONFIRM_EMAIL:
            message = 'Код для подтверждения почты:'
        else:
            raise ValueError('Неизвестный code_purpose.')

        try:
            logger.info(f"send {confirm_code} for user {user.email}")
            with SyncClient.setup(UNISENER_TOKEN):
                request = SendRequest(
                    message={
                        "recipients": [
                            {"email": user.email},
                        ],
                        "body": {
                            "html": html_msg.format(message=message, code=code),
                        },
                        "subject": "Код подтверждения",
                        "from_email": FROM_EMAIL,
                    },
                )
                request.send()
            logger.info("code was send")
        except Exception as e:
            logger.error(f"Error send email confirm code: {e}")

            EmailErrorLog.objects.filter(confirm_code=confirm_code).update(
                message=str(e),
                is_sent=False
            )
        else:
            EmailErrorLog.objects.filter(confirm_code=confirm_code).update(
                is_sent=True,
                message='Sent successfully'
            )
        logger.info("send confirm code done")


    @staticmethod
    def generate_numeric_code():
        return str(secrets.randbelow(10000)).zfill(4)


class ResendConfirmCodeTask(BaseTask):
    def process(self, *args, **kwargs):
        logger.info("start resend code")

        email_error_logs = EmailErrorLog.objects.filter(
            confirm_code__is_used=False,
            is_sent=False,
        )

        for email_error_log in email_error_logs:
            confirm_code = email_error_log.confirm_code

            if confirm_code.purpose == CodePurpose.RESET_PASSWORD:
                message = 'Код для сброса пароля:'
            elif confirm_code.purpose == CodePurpose.CONFIRM_EMAIL:
                message = 'Код для подтверждения почты:'
            else:
                raise ValueError('Неизвестный code_purpose.')

            code = confirm_code.code

            try:
                logger.info(f"send code: {code} for email {email_error_log.user.email}")
                with SyncClient.setup(UNISENER_TOKEN):
                    request = SendRequest(
                        message={
                            "recipients": [
                                {"email": email_error_log.user.email},
                            ],
                            "body": {
                                "html": html_msg.format(message=message, code=code),
                            },
                            "subject": "Код подтверждения",
                            "from_email": FROM_EMAIL,
                        },
                    )
                    request.send()
                logger.info(f"email send")

            except Exception as e:
                logger.error(f"Error send email confirm code: {e}")
        logger.info("end resend code and mark email")
        email_error_logs.update(is_sent=True)


send_confirm_code = app.register_task(SendConfirmCodeTask)
app.register_task(ResendConfirmCodeTask)
