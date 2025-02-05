from django import forms

from apps.kindergarten.models import Kindergarten
from apps.photo.models import PhotoTheme

from dal import autocomplete


class PhotoThemeForm(forms.ModelForm):
    kindergarten = forms.ModelChoiceField(
        queryset=Kindergarten.objects.all(),
        required=False,
        widget=autocomplete.ModelSelect2(
            url='kindergarten-autocomplete'
        ),
        label='Детский сад',
        help_text="Выберите детский сад, в котором проходит фотосессия."
    )

    class Meta:
        model = PhotoTheme
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            qs = Kindergarten.objects.filter(
                kindergartenphototheme__photo_theme=self.instance,
                kindergartenphototheme__is_active=True
            )
            self.fields['kindergarten'].initial = qs.first()
