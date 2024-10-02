from django.db.models.fields.files import ImageField


class NullImageField(ImageField):
    def get_prep_value(self, value):
        if value == '':
            return None
        return super().get_prep_value(value)
