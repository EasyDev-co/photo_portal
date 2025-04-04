from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.conf import settings

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

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
        (_("Personal info"),
         {"fields": (
             'role',
             "first_name",
             'second_name',
             "last_name",
             'birth_date',
             'phone_number',
             'is_verified',
             'managed_kindergarten',
             'un_hashed_password'
         )}),
        (_("Permissions"),
         {"fields": (
             "groups",
             "user_permissions",
             "is_superuser",
             "is_staff"
         )}),
        (_("Important dates"),
         {"fields": (
             "last_login",
             "date_joined"
         )}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    'second_name',
                    "last_name",
                    'phone_number',
                    'role',
                    'is_verified'
                )}),
    )
    list_display = (
        'email',
        'first_name',
        'second_name',
        'last_name',
        'phone_number',
        'role',
        'use_manager_coupon',
        'is_verified',
    )
    search_fields = (
        'email',
        'first_name',
        'second_name',
        'last_name',
        'kindergarten__name',
        'managed_kindergarten__name'
    )
    list_filter = ('role', 'is_verified', 'use_manager_coupon')
    ordering = ('email', 'last_name', 'first_name')
    readonly_fields = ('last_login', 'date_joined')

    inlines = [KindergartenInLine]

    def get_fieldsets(self, request, obj=None):
        if obj:
            match obj.role:
                case UserRole.manager:
                    return (
                        (None, {"fields": ("email", "password")}),
                        (_("Personal info"),
                         {"fields": (
                             'role',
                             "first_name",
                             'second_name',
                             "last_name",
                             'birth_date',
                             'phone_number',
                             'is_verified',
                             'managed_kindergarten',
                             "manager_discount_balance",
                             "manager_discount_intermediate_balance",
                             "manager_discount_balance_empty",
                             'un_hashed_password'
                         )}),
                        (_("Important dates"),
                         {"fields": (
                             "last_login",
                             "date_joined"
                         )}),
                    )
                case UserRole.parent:
                    return (
                        (None, {"fields": ("email", "password")}),
                        (_("Personal info"),
                         {"fields": (
                             'role',
                             "first_name",
                             'second_name',
                             "last_name",
                             'phone_number',
                             'is_verified',
                             'use_manager_coupon'
                         )}),
                        (_("Important dates"),
                         {"fields": (
                             "last_login",
                             "date_joined"
                         )}),
                    )
                case UserRole.staff:
                    fieldsets = (
                        (None, {"fields": ("email", "password")}),
                        (_("Personal info"),
                         {"fields": (
                             'role',
                             "first_name",
                             'second_name',
                             "last_name",
                             'phone_number',
                             'is_verified',
                             'use_manager_coupon'
                         )}),
                        (_("Permissions"),
                         {"fields": (
                             "groups",
                             "user_permissions",
                             "is_superuser",
                             "is_staff"
                         )}),
                        (_("Important dates"),
                         {"fields": (
                             "last_login",
                             "date_joined"
                         )}),
                    )
                    return fieldsets

        return super().get_fieldsets(request, obj)

    def get_inlines(self, request, obj=None):
        if obj and obj.role == UserRole.parent:
            return [KindergartenInLine]
        return []


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


if settings.SHOW_IN_ADMIN:
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

if not settings.SHOW_IN_ADMIN:
    try:
        admin.site.unregister(BlacklistedToken)
    except admin.sites.NotRegistered:
        pass

    try:
        admin.site.unregister(OutstandingToken)
    except admin.sites.NotRegistered:
        pass
