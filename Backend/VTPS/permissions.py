from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrSupervisor(BasePermission):
    """
    Allows access to owners (created_by) or users with supervisor/admin role.
    Assumes the view has a .get_object() method returning the model instance.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser or getattr(user, 'role', None) in ['admin', 'supervisor']:
            return True
        # For objects with 'created_by' or 'assigned_supervisor' fields
        if hasattr(obj, 'created_by') and obj.created_by == user:
            return True
        if hasattr(obj, 'assigned_supervisor') and obj.assigned_supervisor == user:
            return True
        return False

class IsSupervisorOrAdmin(BasePermission):
    """
    Allows access only to users with supervisor or admin role.
    """
    def has_permission(self, request, view):
        user = request.user
        return user.is_superuser or getattr(user, 'role', None) in ['admin', 'supervisor'] 