
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  AlertTriangle,
  Clock,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import Map from '@/components/Map';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'safe' | 'warning' | 'emergency';
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  lastContact: string;
  riskLevel: 'low' | 'medium' | 'high';
  phone: string;
  emergencyContact: string;
  batteryLevel?: number;
  accuracy?: number; // GPS accuracy in meters
}

const LocationTracking = () => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Sample data with coordinates (replace with real data from your backend)
  const [people] = useState<Person[]>([
    {
      id: '1',
      name: 'Mary Johnson',
      age: 78,
      status: 'safe',
      location: 'Home - 123 Oak Street',
      coordinates: [-74.006, 40.7128], // NYC coordinates
      lastContact: '2 minutes ago',
      riskLevel: 'low',
      phone: '+1 (555) 123-4567',
      emergencyContact: 'John Johnson (Son)',
      batteryLevel: 85,
      accuracy: 5
    },
    {
      id: '2',
      name: 'Robert Smith',
      age: 65,
      status: 'warning',
      location: 'Community Center - 456 Pine Ave',
      coordinates: [-74.0059, 40.7589], // NYC coordinates
      lastContact: '15 minutes ago',
      riskLevel: 'medium',
      phone: '+1 (555) 234-5678',
      emergencyContact: 'Sarah Smith (Daughter)',
      batteryLevel: 45,
      accuracy: 8
    },
    {
      id: '3',
      name: 'Linda Davis',
      age: 82,
      status: 'emergency',
      location: 'Unknown - Last seen at Park',
      coordinates: [-73.9857, 40.7484], // NYC coordinates
      lastContact: '1 hour ago',
      riskLevel: 'high',
      phone: '+1 (555) 345-6789',
      emergencyContact: 'Mike Davis (Son)',
      batteryLevel: 15,
      accuracy: 20
    },
    {
      id: '4',
      name: 'James Wilson',
      age: 71,
      status: 'safe',
      location: 'Day Care Center - 789 Elm St',
      coordinates: [-74.0445, 40.6892], // NYC coordinates
      lastContact: '5 minutes ago',
      riskLevel: 'medium',
      phone: '+1 (555) 456-7890',
      emergencyContact: 'Lisa Wilson (Wife)',
      batteryLevel: 70,
      accuracy: 3
    }
  ]);

  const selectedPerson = people.find(p => p.id === selectedPersonId);

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

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh locations
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Location Tracking</h1>
          <p className="text-muted-foreground">
            Monitor vulnerable individuals' locations in real-time
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{people.length}</div>
            <p className="text-xs text-muted-foreground">Active GPS devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {people.filter(p => p.status === 'safe').length}
            </div>
            <p className="text-xs text-muted-foreground">At known locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {people.filter(p => p.status === 'warning').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {people.filter(p => p.status === 'emergency').length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Location Map</CardTitle>
              <CardDescription>
                Real-time GPS tracking of all monitored individuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Map 
                people={people} 
                selectedPersonId={selectedPersonId}
                onPersonSelect={setSelectedPersonId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Person Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracked Individuals</CardTitle>
              <CardDescription>Click on a person to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {people.map((person) => (
                <div 
                  key={person.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPersonId === person.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedPersonId(person.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">Age {person.age}</p>
                    </div>
                    {getStatusBadge(person.status)}
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>GPS: ±{person.accuracy}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Smartphone className={`h-3 w-3 ${getBatteryColor(person.batteryLevel)}`} />
                      <span>Battery: {person.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{person.lastContact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedPerson && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Person</CardTitle>
                <CardDescription>{selectedPerson.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(selectedPerson.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm text-muted-foreground">{selectedPerson.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">GPS Accuracy:</span>
                    <span className="text-sm text-muted-foreground">±{selectedPerson.accuracy}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Battery Level:</span>
                    <span className={`text-sm ${getBatteryColor(selectedPerson.batteryLevel)}`}>
                      {selectedPerson.batteryLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Contact:</span>
                    <span className="text-sm text-muted-foreground">{selectedPerson.lastContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Emergency Contact:</span>
                    <span className="text-sm text-muted-foreground">{selectedPerson.emergencyContact}</span>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Call Emergency Contact
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationTracking;
