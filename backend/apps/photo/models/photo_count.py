from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class UserPhotoCount(models.Model):
    """
    Модель для отслеживания количества фотографий, связанных с пользователем.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь"
    )
    photo_theme = models.ForeignKey(
        "PhotoTheme",
        on_delete=models.CASCADE,
        verbose_name="Фотосессия"
    )
    count = models.PositiveIntegerField(default=3, verbose_name="Осталось пробников добавить")

    def __str__(self):
        return (f"{self.user.first_name}{self.user.last_name} - "
                f"{self.photo_theme.name} - {self.count}")

    class Meta:
        verbose_name = 'Счетчик пробников у пользователя'
        verbose_name_plural = 'Счетчик пробников у пользователя'
