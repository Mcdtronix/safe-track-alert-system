from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import *

# User Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active_session', 'last_activity']
        read_only_fields = ['id', 'last_activity']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        return attrs

# Emergency Contact Serializer
class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

# Safe Zone Serializer
class SafeZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafeZone
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

# Location Log Serializer
class LocationLogSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.full_name', read_only=True)
    
    class Meta:
        model = LocationLog
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']

class LocationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating location logs from GPS devices"""
    device_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = LocationLog
        fields = ['device_id', 'latitude', 'longitude', 'accuracy', 'altitude', 'speed', 'battery_level']
    
    def create(self, validated_data):
        device_id = validated_data.pop('device_id')
        try:
            person = VulnerablePerson.objects.get(gps_device_id=device_id)
            validated_data['person'] = person
            return super().create(validated_data)
        except VulnerablePerson.DoesNotExist:
            raise serializers.ValidationError(f"No person found with device ID: {device_id}")

# Alert Serializers
class AlertSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class AlertCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['person', 'alert_type', 'priority', 'title', 'description', 'location']
        
    def create(self, validated_data):
        validated_data['assigned_to'] = self.context['request'].user
        return super().create(validated_data)

class AlertUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['status', 'assigned_to', 'resolution_notes']

# Vulnerable Person Serializers
class VulnerablePersonListSerializer(serializers.ModelSerializer):
    """Serializer for list view with basic information"""
    emergency_contacts_count = serializers.IntegerField(source='emergency_contacts.count', read_only=True)
    last_location = serializers.SerializerMethodField()
    active_alerts_count = serializers.IntegerField(source='alerts.filter(status=active).count', read_only=True)
    
    class Meta:
        model = VulnerablePerson
        fields = [
            'id', 'first_name', 'last_name', 'age', 'phone', 'email', 'address',
            'risk_level', 'current_status', 'is_being_monitored', 'last_contact_time',
            'emergency_contacts_count', 'last_location', 'active_alerts_count'
        ]
    
    def get_last_location(self, obj):
        last_log = obj.location_logs.first()
        if last_log:
            return {
                'latitude': str(last_log.latitude),
                'longitude': str(last_log.longitude),
                'timestamp': last_log.timestamp,
                'battery_level': last_log.battery_level
            }
        return None

class VulnerablePersonDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all related data"""
    emergency_contacts = EmergencyContactSerializer(many=True, read_only=True)
    safe_zones = SafeZoneSerializer(many=True, read_only=True)
    recent_locations = serializers.SerializerMethodField()
    active_alerts = serializers.SerializerMethodField()
    assigned_supervisor_name = serializers.CharField(source='assigned_supervisor.get_full_name', read_only=True)
    
    class Meta:
        model = VulnerablePerson
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_recent_locations(self, obj):
        recent_logs = obj.location_logs.all()[:10]
        return LocationLogSerializer(recent_logs, many=True).data
    
    def get_active_alerts(self, obj):
        active_alerts = obj.alerts.filter(status='active')
        return AlertSerializer(active_alerts, many=True).data

class VulnerablePersonCreateSerializer(serializers.ModelSerializer):
    emergency_contacts = EmergencyContactSerializer(many=True, required=False)
    
    class Meta:
        model = VulnerablePerson
        fields = [
            'first_name', 'last_name', 'age', 'phone', 'email', 'address',
            'risk_level', 'medical_conditions', 'medications', 'allergies',
            'gps_device_id', 'assigned_supervisor', 'emergency_contacts'
        ]
    
    def create(self, validated_data):
        emergency_contacts_data = validated_data.pop('emergency_contacts', [])
        validated_data['created_by'] = self.context['request'].user
        person = VulnerablePerson.objects.create(**validated_data)
        
        for contact_data in emergency_contacts_data:
            EmergencyContact.objects.create(person=person, **contact_data)
        
        return person

# Check-in Serializers
class CheckInScheduleSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.full_name', read_only=True)
    
    class Meta:
        model = CheckInSchedule
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CheckInLogSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.full_name', read_only=True)
    schedule_name = serializers.CharField(source='schedule.name', read_only=True)
    
    class Meta:
        model = CheckInLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CheckInCreateSerializer(serializers.ModelSerializer):
    """Serializer for completing check-ins"""
    class Meta:
        model = CheckInLog
        fields = ['schedule', 'notes', 'location']
    
    def create(self, validated_data):
        schedule = validated_data['schedule']
        validated_data['person'] = schedule.person
        validated_data['actual_time'] = timezone.now()
        validated_data['status'] = 'completed'
        return super().create(validated_data)

# System Settings Serializer
class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        exclude = ['mapbox_api_key']  # Hide sensitive data
        read_only_fields = ['id', 'created_at', 'updated_at']

# Dashboard Statistics Serializer
class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_people = serializers.IntegerField()
    safe_count = serializers.IntegerField()
    warning_count = serializers.IntegerField()
    emergency_count = serializers.IntegerField()
    active_alerts = serializers.IntegerField()
    total_tracked = serializers.IntegerField()
    recent_alerts = AlertSerializer(many=True)
    people_status = VulnerablePersonListSerializer(many=True)

# Notification Serializer
class NotificationLogSerializer(serializers.ModelSerializer):
    person_name = serializers.CharField(source='person.full_name', read_only=True)
    alert_title = serializers.CharField(source='alert.title', read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

# Real-time Location Update Serializer
class RealTimeLocationSerializer(serializers.Serializer):
    """Serializer for real-time location updates via WebSocket"""
    person_id = serializers.UUIDField()
    latitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    longitude = serializers.DecimalField(max_digits=11, decimal_places=8)
    accuracy = serializers.DecimalField(max_digits=6, decimal_places=2, required=False)
    battery_level = serializers.IntegerField(required=False)
    timestamp = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=['safe', 'warning', 'emergency'])

# Bulk Operations Serializers
class BulkAlertUpdateSerializer(serializers.Serializer):
    alert_ids = serializers.ListField(child=serializers.UUIDField())
    status = serializers.ChoiceField(choices=Alert.STATUS_CHOICES)
    assigned_to = serializers.UUIDField(required=False)
    resolution_notes = serializers.CharField(required=False)

class BulkPersonUpdateSerializer(serializers.Serializer):
    person_ids = serializers.ListField(child=serializers.UUIDField())
    assigned_supervisor = serializers.UUIDField(required=False)
    risk_level = serializers.ChoiceField(choices=VulnerablePerson.RISK_LEVELS, required=False)
    is_being_monitored = serializers.BooleanField(required=False)