from django import forms

from apps.kindergarten.models import Kindergarten
from apps.photo.models import PhotoTheme, PhotoThemeName, Season

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


class PhotoThemeNameForm(forms.ModelForm):
    class Meta:
        model = PhotoThemeName
        fields = '__all__'

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if PhotoThemeName.objects.filter(name=name).exists():
            raise forms.ValidationError("Тема с таким именем уже существует.")
        return name


class SeasonForm(forms.ModelForm):
    class Meta:
        model = Season
        fields = '__all__'

    def clean_season(self):
        season = self.cleaned_data.get('season')
        if Season.objects.filter(season=season).exists():
            raise forms.ValidationError("Сезон с таким названием уже существует.")
        return season
