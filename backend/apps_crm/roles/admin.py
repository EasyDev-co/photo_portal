from django.contrib import admin

from apps_crm.roles.models import (
    Employee, Role, Department, Region, ClientCard
)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'role', 'department', 'region', 'status')
    search_fields = (
        'user__username', 'role__name', 'department__name', 'region__name'
    )
    list_filter = ('role', 'department', 'region', 'status')


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'department', 'parent_role')
    search_fields = ('name',)
    list_filter = ('department',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)


@admin.register(ClientCard)
class ClientCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'responsible_manager', 'region')
    search_fields = ('client',)
    list_filter = ('responsible_manager',)