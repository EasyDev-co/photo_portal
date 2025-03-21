from django.contrib import admin
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import path

from apps.kindergarten.models.region import Region, RegionPriceSettings
from apps.kindergarten.models.photo_price import PhotoPrice, PhotoType
from apps.kindergarten.form import KindergartenForm
from .models import Ransom

from apps.kindergarten.models.kindergarten import Kindergarten

from config.settings import UPLOAD_URL, JQUERY_CDN

from ..photo.models import KindergartenPhotoTheme
from ..utils.services.generate_tokens_for_user import generate_tokens_for_user

User = get_user_model()


class KindergartenInline(admin.TabularInline):
    model = Kindergarten
    extra = 0
    readonly_fields = ['name', 'locality', 'code', 'has_photobook']
    exclude = ['qr_code', ]
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class PhotoPriceInline(admin.TabularInline):
    model = PhotoPrice
    extra = 0
    readonly_fields = ['price', 'photo_type']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Kindergarten)
class KindergartenAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'code', "id", 'has_photobook', 'locality', 'active_photo_theme')
    list_filter = ('region', 'locality')
    search_fields = ('name', 'code')
    readonly_fields = ('qr_image', 'qr_code', 'file_upload', 'manager_info', 'active_photo_theme')
    raw_id_fields = ('region',)
    ordering = ('name',)

    def qr_image(self, obj):
        if obj.qr_code:
            return mark_safe(f'<img src="{obj.qr_code.url}" width="200" height="200" />')

    def get_fields(self, request, obj=None):
        if obj:
            return ('region', 'locality', 'name', 'code', 'has_photobook', 'qr_image', 'qr_code', 'file_upload',
                    'manager_info', 'active_photo_theme')
        return 'region', 'locality', 'name', 'code', 'has_photobook'

    def file_upload(self, obj):
        try:
            active_theme = obj.kindergartenphototheme.get(is_active=True).photo_theme.name
        except KindergartenPhotoTheme.DoesNotExist:
            return f"Добавьте активную фотосессию в разделе Фотосессии, чтобы загружать фото."
        initial = {
            'kindergarten_id': obj.id,
            'photo_theme': active_theme,
            'kindergarten': obj.name,
            'region': obj.region.name,
        }

        form = KindergartenForm(
            initial=initial
        )
        context = {
            'form': form,
            'upload_url': UPLOAD_URL,
            'object': obj,
            'jquery_cdn': JQUERY_CDN,
            'token': generate_tokens_for_user(user=User.objects.filter(is_superuser=True).first()).get('access'),
        }
        html = render_to_string('admin/widgets/drag_and_drop.html', context)
        return mark_safe(html)

    def manager_info(self, obj):
        """Отображает информацию о заведующей, связанной с детским садом."""
        manager = obj.manager
        if manager:
            email = manager.email
            password = manager.un_hashed_password or "Пароль недоступен"
            promocode = manager.promo_codes.latest('created')
            return mark_safe(f"<strong>Email:</strong> {email}<br><strong>Password:</strong> {password}"
                             f"<br><strong>Промокод:</strong> {promocode.code}")
        return "Заведующая не назначена"

    manager_info.short_description = "Информация о заведующей"

    @staticmethod
    def _deactivate_other_themes(obj):
        """Деактивирует все активные фототемы для данного д/с."""
        obj.kindergartenphototheme.filter(is_active=True).update(is_active=False)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'ransom_amount_for_digital_photos', 'ransom_amount_for_calendar')
    ordering = ('name',)
    search_fields = ('name', 'ransom_amount_for_digital_photos', 'ransom_amount_for_calendar')
    inlines = [KindergartenInline, PhotoPriceInline]


@admin.register(PhotoPrice)
class PhotoPriceAdmin(admin.ModelAdmin):
    list_display = ('get_price_display', 'photo_type', 'region')
    raw_id_fields = ('region',)
    ordering = ('region',)

    def get_price_display(self, obj):
        if obj.region:
            return f'Цена для {obj.region.name}: {obj.price}'
        return f'Общая цена для остальных регионов: {obj.price}'

    get_price_display.short_description = 'Цены для регионов'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(photo_type=PhotoType.free_calendar)

    def save_model(self, request, obj, form, change):
        if not obj.region:
            regions = Region.objects.exclude(name__in=['Москва', 'Санкт-Петербург'])

            for region in regions:
                PhotoPrice.objects.update_or_create(
                    region=region,
                    photo_type=obj.photo_type,
                    defaults={'price': obj.price}
                )

            self.message_user(
                request,
                f'Цены успешно добавлены для {len(regions)} регионов, кроме Москвы и Санкт-Петербурга.'
            )
            return
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        """Исключение подарочных типов продукции из выбора"""
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['photo_type'].choices = [
            (choice_value, choice_display) for choice_value, choice_display in form.base_fields['photo_type'].choices
            if choice_value != PhotoType.free_calendar
        ]
        return form


@admin.register(Ransom)
class RansomAdmin(admin.ModelAdmin):
    list_display = ('kindergarten', 'photo_theme', 'ransom_amount', 'average_bill')
    list_filter = ('kindergarten', 'photo_theme')
    list_per_page = 20  # Устанавливает количество записей на странице

    # Настройка отображения связанных полей
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('kindergarten', 'photo_theme')

@admin.register(RegionPriceSettings)
class RegionPriceSettingsAdmin(admin.ModelAdmin):
    """
    Админ-класс для "прокси"-модели, в котором мы делаем одну
    кастомную страницу (настройки цен/выкупа) и больше никаких
    стандартных списков и т.д. не показываем.
    """

    # Чтобы при клике на "Глобальные настройки цен" мы сразу
    # попадали на нашу форму (а не на список объектов), можно
    # скрыть стандартные кнопки, переопределив методы ниже:

    def has_add_permission(self, request):
        return False
    def has_delete_permission(self, request, obj=None):
        return False

    # Самое главное – добавить кастомный URL.
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                '',  # Пустой path => будет открываться по /admin/app/regionpricesettings/
                self.admin_site.admin_view(self.settings_view),
                name='region_price_settings',
            ),
        ]
        return my_urls + urls

    def settings_view(self, request):
        """
        Кастомный view, который обрабатывает GET (показывает форму)
        и POST (обновляет ransom-поля у Region и PhotoPrice у всех регионов).
        """
        photo_types = PhotoType.choices  # [(0, 'Электронные'), (1,'10x15')...]

        if request.method == 'POST':
            # Читаем ransom
            ransom_amount_for_digital_photos = request.POST.get('ransom_amount_for_digital_photos') or None
            ransom_amount_for_calendar = request.POST.get('ransom_amount_for_calendar') or None
            ransom_amount_for_digital_photos_second = request.POST.get('ransom_amount_for_digital_photos_second') or None
            ransom_amount_for_calendar_second = request.POST.get('ransom_amount_for_calendar_second') or None
            ransom_amount_for_digital_photos_third = request.POST.get('ransom_amount_for_digital_photos_third') or None
            ransom_amount_for_calendar_third = request.POST.get('ransom_amount_for_calendar_third') or None

            # Читаем цены на фото
            # Допустим, вводим их в полях с именами price_{код}
            photo_type_prices = {}
            for code, label in photo_types:
                field_name = f'price_{code}'
                value = request.POST.get(field_name) or None
                photo_type_prices[code] = value

            # Обновляем Regions (ransom поля)
            update_data = {}
            if ransom_amount_for_digital_photos:
                update_data['ransom_amount_for_digital_photos'] = ransom_amount_for_digital_photos
            if ransom_amount_for_calendar:
                update_data['ransom_amount_for_calendar'] = ransom_amount_for_calendar
            if ransom_amount_for_digital_photos_second:
                update_data['ransom_amount_for_digital_photos_second'] = ransom_amount_for_digital_photos_second
            if ransom_amount_for_calendar_second:
                update_data['ransom_amount_for_calendar_second'] = ransom_amount_for_calendar_second
            if ransom_amount_for_digital_photos_third:
                update_data['ransom_amount_for_digital_photos_third'] = ransom_amount_for_digital_photos_third
            if ransom_amount_for_calendar_third:
                update_data['ransom_amount_for_calendar_third'] = ransom_amount_for_calendar_third

            if update_data:
                Region.objects.update(**update_data)

            # Обновляем/создаем PhotoPrice для всех регионов и каждого типа
            regions = Region.objects.all()
            for region in regions:
                for code, label in photo_types:
                    new_price = photo_type_prices.get(code)
                    if new_price:
                        PhotoPrice.objects.update_or_create(
                            region=region,
                            photo_type=code,
                            defaults={'price': new_price}
                        )
                    elif code == 7:
                        PhotoPrice.objects.update_or_create(
                            region=region,
                            photo_type=PhotoType.free_calendar,
                            defaults={'price': 0}
                        )

            messages.success(request, "Цены и суммы выкупа обновлены для всех регионов!")
            return redirect('.')  # Перезагрузим эту же страницу

        # Если GET – просто показываем форму
        context = {
            'title': 'Глобальные настройки цен и выкупа',
            'photo_types': photo_types,
        }
        return render(request, 'admin/price_settings.html', context)
