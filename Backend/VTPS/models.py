from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import RegexValidator
import uuid

# Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('supervisor', 'Supervisor'),
        ('operator', 'Operator'),
        ('caregiver', 'Caregiver'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active_session = models.BooleanField(default=False)
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


# Vulnerable Person Model
class VulnerablePerson(models.Model):
    RISK_LEVELS = [
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
    ]
    
    STATUS_CHOICES = [
        ('safe', 'Safe'),
        ('warning', 'Warning'),
        ('emergency', 'Emergency'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'")
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    email = models.EmailField(blank=True, null=True)
    
    # Address Information
    address = models.TextField()
    current_location = models.TextField(blank=True, null=True)
    
    # Risk and Status
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS, default='low')
    current_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='safe')
    
    # Medical Information
    medical_conditions = models.TextField(blank=True, null=True)
    medications = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    
    # Tracking Information
    gps_device_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_being_monitored = models.BooleanField(default=False)
    last_known_location = models.TextField(blank=True, null=True)
    last_contact_time = models.DateTimeField(blank=True, null=True)
    
    # System fields
    assigned_supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_persons')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_persons')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} (Age: {self.age})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


# Emergency Contact Model
class EmergencyContact(models.Model):
    RELATIONSHIP_CHOICES = [
        ('son', 'Son'),
        ('daughter', 'Daughter'),
        ('spouse', 'Spouse'),
        ('sibling', 'Sibling'),
        ('parent', 'Parent'),
        ('friend', 'Friend'),
        ('caregiver', 'Caregiver'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=200)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    phone = models.CharField(validators=[phone_regex], max_length=17)
    email = models.EmailField(blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.relationship} for {self.person.full_name}"


# Location Tracking Model
class LocationLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='location_logs')
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    accuracy = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)  # GPS accuracy in meters
    altitude = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    speed = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)  # Speed in km/h
    battery_level = models.PositiveIntegerField(null=True, blank=True)  # Battery percentage
    location_description = models.TextField(blank=True, null=True)
    is_safe_zone = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['person', '-timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.person.full_name} at {self.latitude}, {self.longitude} - {self.timestamp}"


# Alert System Model
class Alert(models.Model):
    ALERT_TYPES = [
        ('location_missing', 'Missing from Last Known Location'),
        ('safe_zone_exit', 'Exited Safe Zone'),
        ('medication_reminder', 'Medication Reminder'),
        ('check_in_missed', 'Missed Check-in'),
        ('battery_low', 'Low Battery'),
        ('emergency_button', 'Emergency Button Pressed'),
        ('fall_detection', 'Fall Detected'),
        ('geofence_violation', 'Geofence Violation'),
        ('device_offline', 'Device Offline'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.TextField(blank=True, null=True)
    
    # Assignment and Resolution
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_alerts')
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolution_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Notification tracking
    sms_sent = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    push_notification_sent = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['priority', '-created_at']),
            models.Index(fields=['person', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.person.full_name} ({self.priority})"


# Safe Zones Model
class SafeZone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='safe_zones')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    # Geographic boundaries (simple circular zone)
    center_latitude = models.DecimalField(max_digits=10, decimal_places=8)
    center_longitude = models.DecimalField(max_digits=11, decimal_places=8)
    radius_meters = models.PositiveIntegerField(default=100)  # Radius in meters
    
    # Time-based restrictions
    active_start_time = models.TimeField(null=True, blank=True)
    active_end_time = models.TimeField(null=True, blank=True)
    active_days = models.CharField(max_length=20, default='1234567')  # 1=Monday, 7=Sunday
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} for {self.person.full_name}"


# Check-in Schedule Model
class CheckInSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('custom', 'Custom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='checkin_schedules')
    name = models.CharField(max_length=200)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='daily')
    scheduled_time = models.TimeField()
    days_of_week = models.CharField(max_length=20, default='1234567')  # 1=Monday, 7=Sunday
    reminder_minutes_before = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.person.full_name}"


# Check-in Log Model
class CheckInLog(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('missed', 'Missed'),
        ('late', 'Late'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.ForeignKey(CheckInSchedule, on_delete=models.CASCADE, related_name='checkin_logs')
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='checkin_logs')
    scheduled_time = models.DateTimeField()
    actual_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='completed')
    notes = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-scheduled_time']
    
    def __str__(self):
        return f"Check-in for {self.person.full_name} - {self.scheduled_time}"


# System Settings Model
class SystemSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Alert Settings
    enable_sms_alerts = models.BooleanField(default=True)
    enable_email_alerts = models.BooleanField(default=True)
    enable_push_notifications = models.BooleanField(default=True)
    enable_emergency_alerts = models.BooleanField(default=True)
    enable_checkin_reminders = models.BooleanField(default=True)
    enable_location_alerts = models.BooleanField(default=True)
    
    # Location Settings
    location_update_interval_minutes = models.PositiveIntegerField(default=5)
    gps_accuracy_threshold_meters = models.PositiveIntegerField(default=50)
    
    # System Settings
    session_timeout_minutes = models.PositiveIntegerField(default=60)
    max_active_alerts = models.PositiveIntegerField(default=100)
    data_retention_days = models.PositiveIntegerField(default=365)
    
    # Mapbox Configuration
    mapbox_api_key = models.CharField(max_length=200, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"
    
    def __str__(self):
        return f"System Settings - Updated {self.updated_at}"


# Notification Log Model
class NotificationLog(models.Model):
    NOTIFICATION_TYPES = [
        ('sms', 'SMS'),
        ('email', 'Email'),
        ('push', 'Push Notification'),
        ('in_app', 'In-App Notification'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    person = models.ForeignKey(VulnerablePerson, on_delete=models.CASCADE, related_name='notifications')
    recipient = models.CharField(max_length=200)  # Phone number or email
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    message = models.TextField()
    error_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} to {self.recipient} - {self.status}"