from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, VulnerablePerson, EmergencyContact, LocationLog, Alert, SafeZone,
    CheckInSchedule, CheckInLog, SystemSettings, NotificationLog
)

# User admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_active_session', 'last_activity', 'date_joined')
    list_filter = ('role', 'is_active', 'is_active_session')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'role')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'is_active_session', 'last_activity')}),
    )
    readonly_fields = ('last_activity',)

# EmergencyContact inline for VulnerablePerson
class EmergencyContactInline(admin.TabularInline):
    model = EmergencyContact
    extra = 1

# VulnerablePerson admin
@admin.register(VulnerablePerson)
class VulnerablePersonAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'risk_level', 'current_status', 'is_being_monitored', 'assigned_supervisor', 'last_contact_time')
    list_filter = ('risk_level', 'current_status', 'is_being_monitored')
    search_fields = ('first_name', 'last_name', 'phone', 'email', 'gps_device_id')
    inlines = [EmergencyContactInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(LocationLog)
class LocationLogAdmin(admin.ModelAdmin):
    list_display = ('person', 'latitude', 'longitude', 'timestamp', 'is_safe_zone', 'battery_level')
    list_filter = ('is_safe_zone', 'timestamp')
    search_fields = ('person__first_name', 'person__last_name', 'location_description')
    readonly_fields = ('timestamp',)

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'person', 'alert_type', 'priority', 'status', 'assigned_to', 'created_at')
    list_filter = ('alert_type', 'priority', 'status', 'created_at')
    search_fields = ('title', 'description', 'person__first_name', 'person__last_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SafeZone)
class SafeZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'person', 'center_latitude', 'center_longitude', 'radius_meters', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'person__first_name', 'person__last_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CheckInSchedule)
class CheckInScheduleAdmin(admin.ModelAdmin):
    list_display = ('name', 'person', 'frequency', 'scheduled_time', 'is_active')
    list_filter = ('frequency', 'is_active')
    search_fields = ('name', 'person__first_name', 'person__last_name')
    readonly_fields = ('created_at',)

@admin.register(CheckInLog)
class CheckInLogAdmin(admin.ModelAdmin):
    list_display = ('person', 'schedule', 'scheduled_time', 'actual_time', 'status')
    list_filter = ('status', 'scheduled_time')
    search_fields = ('person__first_name', 'person__last_name', 'schedule__name')
    readonly_fields = ('created_at',)

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'enable_sms_alerts', 'enable_email_alerts', 'enable_push_notifications', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('person', 'recipient', 'notification_type', 'status', 'sent_at', 'delivered_at')
    list_filter = ('notification_type', 'status')
    search_fields = ('person__first_name', 'person__last_name', 'recipient', 'message')
    readonly_fields = ('created_at',)
