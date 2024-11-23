from django import forms

from apps.kindergarten.models import Kindergarten
from apps.photo.models import PhotoTheme

from dal import autocomplete


class PhotoThemeForm(forms.ModelForm):
    kindergartens = forms.ModelMultipleChoiceField(
        queryset=Kindergarten.objects.all(),
        required=False,
        widget=autocomplete.ModelSelect2Multiple(
            url='kindergarten-autocomplete'
        ),
        label='Детские сады',
        help_text="Выберите детские сады, в которых проходит фотосессия."
    )

    class Meta:
        model = PhotoTheme
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PhotoThemeForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            # Предзаполнение поля детскими садами, в которых уже проходит фотосессия
            self.fields['kindergartens'].initial = Kindergarten.objects.filter(
                kindergartenphototheme__photo_theme=self.instance,
                kindergartenphototheme__is_active=True
            )
