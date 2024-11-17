from django import forms


class KindergartenForm(forms.Form):
    kindergarten_id = forms.UUIDField(widget=forms.HiddenInput())
    photos = forms.FileField(
        widget=forms.HiddenInput(),
        required=False,
        label="Форма для загрузки файлов"
    )
