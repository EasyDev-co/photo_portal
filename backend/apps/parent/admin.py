from django.contrib import admin

from apps.parent.models.parent import Parent

from apps.kindergarten.models import Kindergarten


class KindergartenInline(admin.TabularInline):
    model = Kindergarten.parents.through
    extra = 0
    verbose_name = "Детский сад"
    verbose_name_plural = "Детские сады"
    fields = ('kindergarten',)


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = (
        'user_email',
        'user_name',
    )
    inlines = [KindergartenInline]

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = 'email'

    def user_name(self, obj):
        return obj.user

    user_name.short_description = 'ФИО'

    def get_fields(self, request, obj=None):
        return ('user',)
