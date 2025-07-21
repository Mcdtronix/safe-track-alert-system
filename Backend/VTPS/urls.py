from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, VulnerablePersonViewSet, EmergencyContactViewSet, LocationLogViewSet, AlertViewSet,
    SafeZoneViewSet, CheckInScheduleViewSet, CheckInLogViewSet, NotificationLogViewSet, SystemSettingsViewSet,
    LoginView, LogoutView, dashboard_stats, bulk_alert_update, bulk_person_update
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'people', VulnerablePersonViewSet)
router.register(r'emergency-contacts', EmergencyContactViewSet)
router.register(r'locations', LocationLogViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'safe-zones', SafeZoneViewSet)
router.register(r'checkin-schedules', CheckInScheduleViewSet)
router.register(r'checkin-logs', CheckInLogViewSet)
router.register(r'notifications', NotificationLogViewSet)
router.register(r'system-settings', SystemSettingsViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('bulk-alert-update/', bulk_alert_update, name='bulk-alert-update'),
    path('bulk-person-update/', bulk_person_update, name='bulk-person-update'),
    path('', include(router.urls)),
]

