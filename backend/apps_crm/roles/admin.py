from django.contrib import admin

from apps_crm.roles.models import (
    Employee, Role, Department, Region
)
from django.conf import settings


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status')
    list_filter = ('status',)


if settings.SHOW_IN_ADMIN:
    @admin.register(Role)
    class RoleAdmin(admin.ModelAdmin):
        list_display = ('name', 'department', 'parent_role')
        search_fields = ('name',)
        list_filter = ('department',)


    @admin.register(Department)
    class DepartmentAdmin(admin.ModelAdmin):
        list_display = ('name',)
        search_fields = ('name',)


    @admin.register(Region)
    class RegionAdmin(admin.ModelAdmin):
        list_display = ('name',)
        search_fields = ('name',)
