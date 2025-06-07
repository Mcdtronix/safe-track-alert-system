
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Calendar
} from 'lucide-react';

interface Alert {
  id: string;
  personId: string;
  personName: string;
  type: 'location' | 'medical' | 'safety' | 'communication';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  assignedTo: string;
  location?: string;
}

const Alerts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      personId: '3',
      personName: 'Linda Davis',
      type: 'location',
      priority: 'critical',
      message: 'Missing from last known location',
      description: 'Linda Davis has not been seen for over 6 hours. Last known location was Central Park. Family has been notified.',
      timestamp: '6 hours ago',
      status: 'active',
      assignedTo: 'Officer Johnson',
      location: 'Central Park area'
    },
    {
      id: '2',
      personId: '2',
      personName: 'Robert Smith',
      type: 'communication',
      priority: 'high',
      message: 'Missed scheduled check-in',
      description: 'Robert Smith failed to complete his scheduled 2 PM check-in. Attempts to contact via phone have been unsuccessful.',
      timestamp: '2 hours ago',
      status: 'investigating',
      assignedTo: 'Case Worker Mary',
      location: 'Community Center'
    },
    {
      id: '3',
      personId: '1',
      personName: 'Mary Johnson',
      type: 'safety',
      priority: 'low',
      message: 'Arrived safely at destination',
      description: 'Mary Johnson has confirmed safe arrival at her daughter\'s house for the weekend visit.',
      timestamp: '10 minutes ago',
      status: 'resolved',
      assignedTo: 'System',
      location: 'Daughter\'s House'
    },
    {
      id: '4',
      personId: '4',
      personName: 'James Wilson',
      type: 'medical',
      priority: 'medium',
      message: 'Medication reminder alert',
      description: 'James Wilson has not confirmed taking his evening medication. Caregiver has been notified.',
      timestamp: '1 hour ago',
      status: 'active',
      assignedTo: 'Nurse Patricia',
      location: 'Day Care Center'
    },
    {
      id: '5',
      personId: '2',
      personName: 'Robert Smith',
      type: 'safety',
      priority: 'high',
      message: 'Wandering behavior detected',
      description: 'Robert Smith was found outside his designated safe zone. Staff intervened and he is now safe.',
      timestamp: '1 day ago',
      status: 'resolved',
      assignedTo: 'Security Team',
      location: 'Outside Community Center'
    }
  ]);

  const filteredAlerts = alerts.filter(alert =>
    alert.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Active</Badge>;
      case 'investigating':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'medical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'safety':
        return <CheckCircle className="h-4 w-4" />;
      case 'communication':
        return <Phone className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const sendTextAlert = (alert: Alert) => {
    console.log(`Sending escalation alert for ${alert.personName}`);
    alert(`Emergency text alert sent for ${alert.personName} - ${alert.message}`);
  };

  const resolveAlert = (alertId: string) => {
    console.log(`Resolving alert ${alertId}`);
    alert(`Alert ${alertId} has been marked as resolved`);
  };

  const activeAlerts = filteredAlerts.filter(a => a.status === 'active');
  const investigatingAlerts = filteredAlerts.filter(a => a.status === 'investigating');
  const resolvedAlerts = filteredAlerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Monitor and manage all system alerts and notifications
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Export</Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="investigating">
            Investigating ({investigatingAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(alert.type)}
                      <CardTitle className="text-lg">{alert.message}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{alert.personName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{alert.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>Assigned to: {alert.assignedTo}</span>
                    {alert.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => sendTextAlert(alert)}
                    className="flex items-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Send Text Alert</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {activeAlerts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No active alerts. All systems normal.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="investigating" className="space-y-4">
          {investigatingAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-yellow-500">
              {/* ... Similar card structure but with investigating-specific styling */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(alert.type)}
                      <CardTitle className="text-lg">{alert.message}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{alert.personName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{alert.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>Assigned to: {alert.assignedTo}</span>
                    {alert.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-green-500 opacity-75">
              {/* ... Similar structure for resolved alerts */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(alert.type)}
                      <CardTitle className="text-lg">{alert.message}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{alert.personName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{alert.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.status === 'active' ? 'border-l-red-500' :
              alert.status === 'investigating' ? 'border-l-yellow-500' :
              'border-l-green-500 opacity-75'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(alert.type)}
                      <CardTitle className="text-lg">{alert.message}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{alert.personName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{alert.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
