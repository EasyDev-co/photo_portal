from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, reverse


class SingletonModelAdmin(admin.ModelAdmin):
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('', self.admin_site.admin_view(self.redirect_to_change)),
        ]
        return custom_urls + urls

    def redirect_to_change(self, request):
        obj = self.model.load()
        change_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=(obj.pk,))
        return HttpResponseRedirect(change_url)

    def has_add_permission(self, request, obj=None):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def response_add(self, request, obj, post_url_continue=None):
        return HttpResponseRedirect(
            reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=(obj.pk,))
        )

    def response_change(self, request, obj):
        return HttpResponseRedirect(
            reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=(obj.pk,)))
