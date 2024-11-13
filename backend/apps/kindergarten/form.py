from apps.photo.models.photo_theme import PhotoTheme
from django import forms
from .widget import DragAndDropWidget


class KindergartenForm(forms.Form):
    kindergarten_id = forms.UUIDField(widget=forms.HiddenInput())
    photos = forms.FileField(
        widget=forms.HiddenInput(),
        required=False,
        label="Форма для загрузки файлов"
    )
