
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'safe' | 'warning' | 'emergency';
  location: string;
  lastContact: string;
  riskLevel: 'low' | 'medium' | 'high';
  phone: string;
  email: string;
  emergencyContact: string;
  medicalInfo: string;
}

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [people] = useState<Person[]>([
    {
      id: '1',
      name: 'Mary Johnson',
      age: 78,
      status: 'safe',
      location: 'Home - 123 Oak Street',
      lastContact: '10 minutes ago',
      riskLevel: 'low',
      phone: '+1 (555) 123-4567',
      email: 'mary.johnson@email.com',
      emergencyContact: 'John Johnson (Son) - +1 (555) 987-6543',
      medicalInfo: 'Diabetes, Hypertension'
    },
    {
      id: '2',
      name: 'Robert Smith',
      age: 65,
      status: 'warning',
      location: 'Community Center - 456 Pine Ave',
      lastContact: '2 hours ago',
      riskLevel: 'medium',
      phone: '+1 (555) 234-5678',
      email: 'robert.smith@email.com',
      emergencyContact: 'Sarah Smith (Daughter) - +1 (555) 876-5432',
      medicalInfo: 'Early stage dementia, Heart condition'
    },
    {
      id: '3',
      name: 'Linda Davis',
      age: 82,
      status: 'emergency',
      location: 'Unknown - Last seen at Park',
      lastContact: '6 hours ago',
      riskLevel: 'high',
      phone: '+1 (555) 345-6789',
      email: 'linda.davis@email.com',
      emergencyContact: 'Mike Davis (Son) - +1 (555) 765-4321',
      medicalInfo: 'Alzheimer disease, Mobility issues'
    },
    {
      id: '4',
      name: 'James Wilson',
      age: 71,
      status: 'safe',
      location: 'Day Care Center - 789 Elm St',
      lastContact: '30 minutes ago',
      riskLevel: 'medium',
      phone: '+1 (555) 456-7890',
      email: 'james.wilson@email.com',
      emergencyContact: 'Lisa Wilson (Wife) - +1 (555) 654-3210',
      medicalInfo: 'Mild cognitive impairment'
    }
  ]);

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="outline" className="text-green-600 border-green-600">Low Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium Risk</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-red-600 border-red-600">High Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const sendTextAlert = (person: Person) => {
    console.log(`Sending text alert to ${person.name} at ${person.phone}`);
    alert(`Text alert sent to ${person.name} at ${person.phone}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            Manage and monitor vulnerable individuals
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Person</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPeople.map((person) => (
          <Card key={person.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{person.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      (Age {person.age})
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(person.status)}
                    {getRiskBadge(person.riskLevel)}
                  </CardDescription>
                </div>
                {person.status === 'emergency' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{person.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last contact: {person.lastContact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{person.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{person.email}</span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div>
                  <p className="text-sm font-medium">Emergency Contact</p>
                  <p className="text-sm text-muted-foreground">{person.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Medical Information</p>
                  <p className="text-sm text-muted-foreground">{person.medicalInfo}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => sendTextAlert(person)}
                  className="flex items-center space-x-1"
                >
                  <Phone className="h-4 w-4" />
                  <span>Send Alert</span>
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No people found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default People;
