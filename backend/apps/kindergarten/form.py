from django import forms

from apps.kindergarten.models import Kindergarten


class KindergartenForm(forms.Form):
    kindergarten_id = forms.UUIDField(widget=forms.HiddenInput())
    kindergarten = forms.CharField(widget=forms.HiddenInput())
    region = forms.CharField(widget=forms.HiddenInput())
    photo_theme = forms.CharField(widget=forms.HiddenInput())
    photos = forms.FileField(
        widget=forms.HiddenInput(),
        required=False,
        label="Форма для загрузки файлов"
    )
