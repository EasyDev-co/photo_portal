import traceback

from apps.utils.services.remove_qr_code import remove_qr_code
from config.celery import BaseTask, app


class QRCodeRemoverTask(BaseTask):
    """
    Поиск и удаление изображений QR кодов устаревших фотолиний.
    """

    def process(self, *args, **kwargs):
        try:
            remove_qr_code()
        except Exception as e:
            self.on_failure(
                exc=e,
                task_id=self.request.id,
                args=(),
                kwargs={},
                einfo=traceback.format_exc(),
            )


app.register_task(QRCodeRemoverTask)
