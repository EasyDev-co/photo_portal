from django.db import transaction

from apps.photo.models import KindergartenPhotoTheme


def update_photo_theme_kindergartens(form, obj) -> dict | None:
    """Обновление связей между д/с и фотосессией."""
    retained_kindergartens = form.cleaned_data['kindergartens']
    initial_kindergartens = form.fields.get('kindergartens').initial
    added_kindergartens = retained_kindergartens.exclude(pk__in=initial_kindergartens)
    removed_kindergartens = initial_kindergartens.exclude(pk__in=retained_kindergartens)

    if not obj.ongoing and set(initial_kindergartens) != set(retained_kindergartens):
        return {
            'message': f'Фотосессия "{obj.name}" сохранена, но детские сады не были изменены, так как она не '
                       f'активна.'}

    with transaction.atomic():
        if added_kindergartens:
            for kindergarten in added_kindergartens:
                KindergartenPhotoTheme.objects.update_or_create(
                    kindergarten=kindergarten,
                    photo_theme=obj,
                    defaults={'is_active': True}
                )

        if removed_kindergartens:
            KindergartenPhotoTheme.objects.filter(
                kindergarten__in=removed_kindergartens,
                photo_theme=obj,
            ).update(is_active=False)
