
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, BellOff, MessageSquare, AlertCircle, Users, Save } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    messageNotifications: true,
    groupNotifications: true,
    callNotifications: true,
    inAppNotifications: true,
    emailNotifications: false,
    businessNotifications: true,
    notificationSound: "default",
    vibration: true,
    notificationLight: true
  });

  const handleSwitchChange = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Notification settings updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Control how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="messageNotifications">Message Notifications</Label>
              </div>
              <Switch 
                id="messageNotifications" 
                checked={settings.messageNotifications} 
                onCheckedChange={() => handleSwitchChange('messageNotifications')} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive notifications for new messages
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="groupNotifications">Group Notifications</Label>
              </div>
              <Switch 
                id="groupNotifications" 
                checked={settings.groupNotifications} 
                onCheckedChange={() => handleSwitchChange('groupNotifications')} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive notifications for group messages
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="callNotifications">Call Notifications</Label>
              </div>
              <Switch 
                id="callNotifications" 
                checked={settings.callNotifications} 
                onCheckedChange={() => handleSwitchChange('callNotifications')} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive notifications for incoming calls
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="businessNotifications">Business Notifications</Label>
              </div>
              <Switch 
                id="businessNotifications" 
                checked={settings.businessNotifications} 
                onCheckedChange={() => handleSwitchChange('businessNotifications')} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive notifications about business updates and services
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>
              <Switch 
                id="emailNotifications" 
                checked={settings.emailNotifications} 
                onCheckedChange={() => handleSwitchChange('emailNotifications')} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive important notifications via email
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="notificationSound">Notification Sound</Label>
                <Select 
                  value={settings.notificationSound} 
                  onValueChange={(value) => handleSelectChange('notificationSound', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="melody">Melody</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="vibration">Vibration</Label>
                <Switch 
                  id="vibration" 
                  checked={settings.vibration} 
                  onCheckedChange={() => handleSwitchChange('vibration')} 
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="notificationLight">Notification Light</Label>
                <Switch 
                  id="notificationLight" 
                  checked={settings.notificationLight} 
                  onCheckedChange={() => handleSwitchChange('notificationLight')} 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
