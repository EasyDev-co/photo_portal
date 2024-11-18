from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from apps.user.models import ConfirmCode
from apps.user.models.manager_bonus import ManagerBonus
from apps.kindergarten.models import Kindergarten
from apps.user.models.email_error_log import EmailErrorLog
from apps.user.models.user import UserRole, StaffUser

User = get_user_model()


class KindergartenInLine(admin.TabularInline):
    model = Kindergarten.users.through
    extra = 0
    verbose_name = "Детский сад"
    verbose_name_plural = "Детские сады"
    fields = ("kindergarten",)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    'role',
                    "first_name",
                    'second_name',
                    "last_name",
                    'birth_date',
                    'phone_number',
                    'un_hashed_password',
                    'is_verified',
                    'managed_kindergarten'
                )
            }
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "groups",
                    "user_permissions",
                    "is_superuser",
                    "is_staff"
                ),
            },
        ),
        (
            _("Important dates"),
            {
                "fields": (
                    "last_login",
                    "date_joined"
                )
            }
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    'second_name',
                    "last_name",
                    'phone_number',
                    'role',
                    'is_verified',
                    'managed_kindergarten'
                ),
            },
        ),
    )
    list_display = (
        'id',
        'email',
        'first_name',
        'second_name',
        'last_name',
        'phone_number',
        'role',
        'is_verified',
        'managed_kindergarten'
    )
    search_fields = (
        'email',
        'first_name',
        'second_name',
        'last_name',
    )
    list_filter = ('role', 'is_verified')
    ordering = ('email', 'last_name', 'first_name')
    readonly_fields = ('last_login', 'date_joined')

    inlines = [KindergartenInLine]


@admin.register(StaffUser)
class StaffAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name"
                )
            }
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            _("Important dates"),
            {
                "fields": (
                    "last_login",
                    "date_joined"
                )
            }
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name"
                ),
            },
        ),
    )
    list_display = (
        'id',
        'first_name',
        'last_name',
        'email'
    )
    search_fields = (
        'email',
        'first_name',
        'last_name',
    )
    ordering = ('email',)
    readonly_fields = ('last_login', 'date_joined')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_staff=True, is_superuser=False)

    def save_model(self, request, obj, form, change):
        obj.is_staff = True
        obj.role = UserRole.manager
        obj.is_verified = True
        super().save_model(request, obj, form, change)


@admin.register(EmailErrorLog)
class EmailErrorLogAdmin(admin.ModelAdmin):
    list_display = (
        'confirm_code',
        'message',
        'is_sent',
        'created_at',
        'user'
    )
    search_fields = (
        'user__email',
    )
    ordering = ('created_at',)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ConfirmCode)
class ConfirmCodeAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'code',
        'created_at',
        'purpose',
        'is_used',
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ManagerBonus)
class ManagerBonus(admin.ModelAdmin):
    list_display = (
        'user',
        'photo_theme',
        'bonus_size',
        'total_bonus',
        'paid_for',
    )
    raw_id_fields = ('user',)
