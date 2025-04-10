from django.contrib import admin
from django.conf import settings
from django import forms

from apps.promocode.models import Promocode
from apps.kindergarten.models import Kindergarten
from apps.promocode.models.bonus_coupon import BonusCoupon

class PromocodeCreateForm(forms.ModelForm):
    """Форма создания промокода без отображения photo_theme и user."""
    kindergarten = forms.ModelChoiceField(
        queryset=Kindergarten.objects.all(),
        required=True,
        label="Детский сад"
    )

    class Meta:
        model = Promocode
        # Исключаем поля, которые не нужны при создании
        exclude = ("user", "photo_theme",)

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Проставляем user из выбранного детского сада
        selected_kindergarten = self.cleaned_data['kindergarten']
        instance.user = selected_kindergarten.manager  # manager — это related_name='manager' у Kindergarten
        if commit:
            instance.save()
        return instance


@admin.register(Promocode)
class PromocodeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'code',
        'created',
        'modified',
        'is_active',
        'kindergarten'
    )
    readonly_fields = (
        'created',
        'modified',
        'actual_kindergarten',
        'user',
    )

    fieldsets = (
        ("Промокод",
            {
             "fields":
              (
                  "code",
                  "is_active",
                  "created",
                  "modified"
              )
            }
        ),
        (
            "Детсткий сад", {
                "fields": (
                    "actual_kindergarten",
                    "kindergarten",
                    "user",
                )
            }
        ),
        (
            "История применений и кол-во оставшихся активаций", {
                "fields": (
                    "activate_count",
                    "used_by",
                )
            }
        )
    )

    def get_readonly_fields(self, request, obj=None):
        """
        Если объект уже существует (редактирование),
        делаем поле user также readonly.
        """
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields

    def actual_kindergarten(self, obj):
        if obj.user and obj.user.managed_kindergarten:
            return obj.user.managed_kindergarten
        return "-"
    actual_kindergarten.short_description = 'Текущий детский сад'

    def kindergarten(self, obj):
        return obj.user.managed_kindergarten
    kindergarten.short_description = 'Детский сад'

    def get_form(self, request, obj=None, **kwargs):
        """
        При создании промокода возвращаем кастомную форму,
        при редактировании — стандартную.
        """
        kwargs['form'] = PromocodeCreateForm
        return super().get_form(request, obj, **kwargs)

if settings.SHOW_IN_ADMIN:
    @admin.register(BonusCoupon)
    class BonusCouponAdmin(admin.ModelAdmin):
        list_display = (
            'user',
            'balance',
            'created',
            'modified',
        )
        raw_id_fields = ('user',)
