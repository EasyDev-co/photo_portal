from apps.photo.models.photo_theme import PhotoTheme
from django import forms
from .widget import DragAndDropWidget


class KindergartenForm(forms.Form):
    photo_theme = forms.ModelChoiceField(
        queryset=PhotoTheme.objects.all(),
        required=False,
        label='Фотосессия'
    )
    photos = forms.FileField(
        widget=DragAndDropWidget(),
        required=False,
        label="Форма для загрузки файлов"
    )
