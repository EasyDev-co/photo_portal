from django.contrib import admin
from django.contrib.auth import get_user_model

from apps.user.models import ConfirmCode
from apps.user.models.manager_bonus import ManagerBonus
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
    search_fields = (
        'email',
        'first_name',
        'second_name',
        'lastname',
        'promocode',
    )
    list_filter = ('role', 'is_verified')
    raw_id_fields = ('promocode',)

    inlines = [KindergartenInLine]


@admin.register(ConfirmCode)
class ConfirmCodeAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'code',
        'created_at',
        'purpose',
        'is_used',
    )


@admin.register(ManagerBonus)
class ManagerBonus(admin.ModelAdmin):
    list_display = (
        'user',
        'start_period_date',
        'end_period_date',
        'bonus_size',
        'total_bonus',
        'paid_for',
    )
    raw_id_fields = ('user',)
