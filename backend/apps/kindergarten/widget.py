from django import forms


class DragAndDropWidget(forms.ClearableFileInput):
    template_name = 'admin/widgets/drag_and_drop.html'

