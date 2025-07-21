from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import login, logout
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone
from datetime import timedelta
from .models import *
from .serializers import *
from .permissions import IsOwnerOrSupervisor, IsSupervisorOrAdmin

# Authentication Views
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        user.is_active_session = True
        user.save()
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.is_active_session = False
        request.user.save()
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSupervisorOrAdmin]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'role']
    filterset_fields = ['role', 'is_active_session']

class VulnerablePersonViewSet(ModelViewSet):
    queryset = VulnerablePerson.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'phone', 'email']
    filterset_fields = ['risk_level', 'current_status', 'is_being_monitored', 'assigned_supervisor']

    def get_serializer_class(self):
        if self.action == 'list':
            return VulnerablePersonListSerializer
        elif self.action == 'retrieve':
            return VulnerablePersonDetailSerializer
        elif self.action == 'create':
            return VulnerablePersonCreateSerializer
        return VulnerablePersonDetailSerializer

class EmergencyContactViewSet(ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'relationship', 'phone', 'email']
    filterset_fields = ['person', 'is_primary']

class LocationLogViewSet(ModelViewSet):
    queryset = LocationLog.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['person__first_name', 'person__last_name']
    filterset_fields = ['person', 'is_safe_zone']

    def get_serializer_class(self):
        if self.action == 'create':
            return LocationCreateSerializer
        return LocationLogSerializer

class AlertViewSet(ModelViewSet):
    queryset = Alert.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'alert_type', 'priority', 'status']
    filterset_fields = ['person', 'status', 'priority', 'alert_type', 'assigned_to']

    def get_serializer_class(self):
        if self.action == 'create':
            return AlertCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AlertUpdateSerializer
        return AlertSerializer

class SafeZoneViewSet(ModelViewSet):
    queryset = SafeZone.objects.all()
    serializer_class = SafeZoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['person', 'is_active']

class CheckInScheduleViewSet(ModelViewSet):
    queryset = CheckInSchedule.objects.all()
    serializer_class = CheckInScheduleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'frequency']
    filterset_fields = ['person', 'is_active']

class CheckInLogViewSet(ModelViewSet):
    queryset = CheckInLog.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['person__first_name', 'person__last_name', 'status']
    filterset_fields = ['person', 'status', 'schedule']

    def get_serializer_class(self):
        if self.action == 'create':
            return CheckInCreateSerializer
        return CheckInLogSerializer

class NotificationLogViewSet(ModelViewSet):
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['recipient', 'notification_type', 'status']
    filterset_fields = ['person', 'alert', 'notification_type', 'status']

class SystemSettingsViewSet(ModelViewSet):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAuthenticated, IsSupervisorOrAdmin]

# Dashboard statistics endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_people = VulnerablePerson.objects.count()
    safe_count = VulnerablePerson.objects.filter(current_status='safe').count()
    warning_count = VulnerablePerson.objects.filter(current_status='warning').count()
    emergency_count = VulnerablePerson.objects.filter(current_status='emergency').count()
    active_alerts = Alert.objects.filter(status='active').count()
    total_tracked = VulnerablePerson.objects.filter(is_being_monitored=True).count()
    recent_alerts = Alert.objects.order_by('-created_at')[:10]
    people_status = VulnerablePerson.objects.all()[:10]
    data = {
        'total_people': total_people,
        'safe_count': safe_count,
        'warning_count': warning_count,
        'emergency_count': emergency_count,
        'active_alerts': active_alerts,
        'total_tracked': total_tracked,
        'recent_alerts': AlertSerializer(recent_alerts, many=True).data,
        'people_status': VulnerablePersonListSerializer(people_status, many=True).data
    }
    return Response(data)

# Bulk update endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSupervisorOrAdmin])
def bulk_alert_update(request):
    serializer = BulkAlertUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    alert_ids = serializer.validated_data['alert_ids']
    status_value = serializer.validated_data['status']
    assigned_to = serializer.validated_data.get('assigned_to')
    resolution_notes = serializer.validated_data.get('resolution_notes')
    alerts = Alert.objects.filter(id__in=alert_ids)
    for alert in alerts:
        alert.status = status_value
        if assigned_to:
            alert.assigned_to_id = assigned_to
        if resolution_notes:
            alert.resolution_notes = resolution_notes
        alert.save()
    return Response({'detail': 'Bulk alert update successful.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSupervisorOrAdmin])
def bulk_person_update(request):
    serializer = BulkPersonUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    person_ids = serializer.validated_data['person_ids']
    assigned_supervisor = serializer.validated_data.get('assigned_supervisor')
    risk_level = serializer.validated_data.get('risk_level')
    is_being_monitored = serializer.validated_data.get('is_being_monitored')
    people = VulnerablePerson.objects.filter(id__in=person_ids)
    for person in people:
        if assigned_supervisor:
            person.assigned_supervisor_id = assigned_supervisor
        if risk_level:
            person.risk_level = risk_level
        if is_being_monitored is not None:
            person.is_being_monitored = is_being_monitored
        person.save()
    return Response({'detail': 'Bulk person update successful.'})