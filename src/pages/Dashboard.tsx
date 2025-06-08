
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  Activity
} from 'lucide-react';

interface Person {
  id: string;
  name: string;
  status: 'safe' | 'warning' | 'emergency';
  location: string;
  lastContact: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Alert {
  id: string;
  personId: string;
  personName: string;
  type: 'location' | 'medical' | 'safety' | 'communication';
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

const Dashboard = () => {
  const [people] = useState<Person[]>([
    { id: '1', name: 'Mary Johnson', status: 'safe', location: 'Home', lastContact: '10 minutes ago', riskLevel: 'low' },
    { id: '2', name: 'Robert Smith', status: 'warning', location: 'Community Center', lastContact: '2 hours ago', riskLevel: 'medium' },
    { id: '3', name: 'Linda Davis', status: 'emergency', location: 'Unknown', lastContact: '6 hours ago', riskLevel: 'high' },
    { id: '4', name: 'James Wilson', status: 'safe', location: 'Day Care', lastContact: '30 minutes ago', riskLevel: 'medium' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: '1', personId: '3', personName: 'Linda Davis', type: 'location', message: 'Missing from last known location', timestamp: '6 hours ago', status: 'active' },
    { id: '2', personId: '2', personName: 'Robert Smith', type: 'communication', message: 'Missed scheduled check-in', timestamp: '2 hours ago', status: 'active' },
    { id: '3', personId: '1', personName: 'Mary Johnson', type: 'safety', message: 'Arrived safely at destination', timestamp: '10 minutes ago', status: 'resolved' },
  ]);

  const safeCount = people.filter(p => p.status === 'safe').length;
  const warningCount = people.filter(p => p.status === 'warning').length;
  const emergencyCount = people.filter(p => p.status === 'emergency').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Safe</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>;
      case 'emergency':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Emergency</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const sendTextAlert = (personName: string) => {
    // Simulate sending text alert
    console.log(`Sending text alert for ${personName}`);
    alert(`Text alert sent for ${personName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of vulnerable person tracking and alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total People Card - Green */}
        <Card className="bg-dashboard-green text-dashboard-green-foreground border-dashboard-green">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dashboard-green-foreground">Total People</CardTitle>
            <Users className="h-4 w-4 text-dashboard-green-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-green-foreground">{people.length}</div>
            <p className="text-xs text-dashboard-green-foreground/80">
              Currently being monitored
            </p>
          </CardContent>
        </Card>

        {/* Safe Card - Green */}
        <Card className="bg-dashboard-green text-dashboard-green-foreground border-dashboard-green">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dashboard-green-foreground">Safe</CardTitle>
            <CheckCircle className="h-4 w-4 text-dashboard-green-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-green-foreground">{safeCount}</div>
            <p className="text-xs text-dashboard-green-foreground/80">
              People confirmed safe
            </p>
          </CardContent>
        </Card>

        {/* Warnings Card - Gold */}
        <Card className="bg-dashboard-gold text-dashboard-gold-foreground border-dashboard-gold">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dashboard-gold-foreground">Warnings</CardTitle>
            <Clock className="h-4 w-4 text-dashboard-gold-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-gold-foreground">{warningCount}</div>
            <p className="text-xs text-dashboard-gold-foreground/80">
              Require attention
            </p>
          </CardContent>
        </Card>

        {/* Emergency Card - Red */}
        <Card className="bg-dashboard-red text-dashboard-red-foreground border-dashboard-red">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dashboard-red-foreground">Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-dashboard-red-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-dashboard-red-foreground">{emergencyCount}</div>
            <p className="text-xs text-dashboard-red-foreground/80">
              Immediate action required
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Alerts - Using custom nav background color */}
        <Card className="col-span-4 bg-nav text-nav-foreground border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-nav-foreground">Active Alerts</CardTitle>
            <CardDescription className="text-nav-foreground/80">
              Recent alerts requiring attention ({activeAlerts} active)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.filter(a => a.status === 'active').map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border border-sidebar-border rounded-lg bg-sidebar-accent/20">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium text-nav-foreground">{alert.personName}</p>
                      <p className="text-sm text-nav-foreground/80">{alert.message}</p>
                      <p className="text-xs text-nav-foreground/60">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendTextAlert(alert.personName)}
                    className="flex items-center space-x-2 bg-sidebar-accent hover:bg-sidebar-accent/80"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Send Alert</span>
                  </Button>
                </div>
              ))}
              {activeAlerts === 0 && (
                <p className="text-nav-foreground/60 text-center py-4">No active alerts</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* People Status - Using custom nav background color */}
        <Card className="col-span-3 bg-nav text-nav-foreground border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-nav-foreground">People Status</CardTitle>
            <CardDescription className="text-nav-foreground/80">
              Current status of all monitored individuals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-nav-foreground">{person.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-nav-foreground/80">
                        <MapPin className="h-3 w-3" />
                        <span>{person.location}</span>
                      </div>
                      <p className="text-xs text-nav-foreground/60">
                        Last contact: {person.lastContact}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {getStatusBadge(person.status)}
                    <p className="text-xs text-nav-foreground/60">
                      Risk: {person.riskLevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
