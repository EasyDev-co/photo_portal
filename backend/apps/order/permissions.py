from rest_framework.permissions import BasePermission


class IsOrdersPaymentOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.orders.first().user
