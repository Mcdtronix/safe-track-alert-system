
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Phone,
  Mail,
  Clock,
  MapPin
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [alertSettings, setAlertSettings] = useState({
    textAlerts: true,
    emailAlerts: true,
    pushNotifications: true,
    emergencyAlerts: true,
    checkInReminders: true,
    locationAlerts: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    checkInInterval: '60',
    emergencyTimeout: '30',
    locationUpdateFreq: '15',
    autoEscalation: true,
    requireConfirmation: true,
  });

  const [contactSettings, setContactSettings] = useState({
    primaryPhone: '+1 (555) 911-0000',
    secondaryPhone: '+1 (555) 911-0001',
    emergencyEmail: 'emergency@vtps.com',
    smsProvider: 'twilio',
  });

  const saveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings...', { alertSettings, systemSettings, contactSettings });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and alert settings
        </p>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alert Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Text Message Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS notifications for important alerts
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.textAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, textAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for all alerts
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.emailAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, emailAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Browser and mobile push notifications
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      High priority emergency notifications
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.emergencyAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, emergencyAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Check-in Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind staff about scheduled check-ins
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.checkInReminders}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, checkInReminders: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Location Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when people leave safe zones
                    </p>
                  </div>
                  <Switch
                    checked={alertSettings.locationAlerts}
                    onCheckedChange={(checked) =>
                      setAlertSettings(prev => ({ ...prev, locationAlerts: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure system timing and behavior settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in Interval (minutes)</Label>
                  <Input
                    id="checkIn"
                    type="number"
                    value={systemSettings.checkInInterval}
                    onChange={(e) =>
                      setSystemSettings(prev => ({ ...prev, checkInInterval: e.target.value }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    How often people should check in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Response Timeout (minutes)</Label>
                  <Input
                    id="emergency"
                    type="number"
                    value={systemSettings.emergencyTimeout}
                    onChange={(e) =>
                      setSystemSettings(prev => ({ ...prev, emergencyTimeout: e.target.value }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Time before escalating to emergency status
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Update Frequency (minutes)</Label>
                  <Input
                    id="location"
                    type="number"
                    value={systemSettings.locationUpdateFreq}
                    onChange={(e) =>
                      setSystemSettings(prev => ({ ...prev, locationUpdateFreq: e.target.value }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    How often to request location updates
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Escalation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically escalate unresolved alerts
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoEscalation}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, autoEscalation: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Require confirmation for alert resolutions
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.requireConfirmation}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, requireConfirmation: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
              <CardDescription>
                Configure emergency contact information and SMS settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Emergency Phone</Label>
                  <Input
                    id="primaryPhone"
                    type="tel"
                    value={contactSettings.primaryPhone}
                    onChange={(e) =>
                      setContactSettings(prev => ({ ...prev, primaryPhone: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Emergency Phone</Label>
                  <Input
                    id="secondaryPhone"
                    type="tel"
                    value={contactSettings.secondaryPhone}
                    onChange={(e) =>
                      setContactSettings(prev => ({ ...prev, secondaryPhone: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail">Emergency Email</Label>
                  <Input
                    id="emergencyEmail"
                    type="email"
                    value={contactSettings.emergencyEmail}
                    onChange={(e) =>
                      setContactSettings(prev => ({ ...prev, emergencyEmail: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Input
                    id="smsProvider"
                    value={contactSettings.smsProvider}
                    onChange={(e) =>
                      setContactSettings(prev => ({ ...prev, smsProvider: e.target.value }))
                    }
                    placeholder="twilio, textmagic, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Two-Factor Authentication</h4>
                  <Button variant="outline">Enable 2FA</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Session Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      defaultValue="8"
                      className="w-32"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Audit Log</h4>
                  <Button variant="outline">View Activity Log</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    View all account activity and login attempts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} className="w-32">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
