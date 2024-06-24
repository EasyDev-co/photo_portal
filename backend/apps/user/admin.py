from django.contrib import admin
from django.contrib.auth import get_user_model

from apps.kindergarten.models import Kindergarten

User = get_user_model()


class KindergartenInLine(admin.TabularInline):
    model = Kindergarten.users.through
    extra = 0
    verbose_name = "Детский сад"
    verbose_name_plural = "Детские сады"
    fields = ("kindergarten",)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'email',
        'first_name',
        'second_name',
        'last_name',
        'role',
        'promocode',
        'is_verified',
    )

    inlines = [KindergartenInLine]
