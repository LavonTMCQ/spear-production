"use client";

import { useState } from "react";
import { NotificationDemo } from "@/components/admin/notification-demo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Cog6ToothIcon, BellIcon, PaintBrushIcon, ShieldCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Mock settings data
const mockSettings = {
  general: {
    companyName: "SPEAR Technologies",
    supportEmail: "support@spear-tech.com",
    supportPhone: "+1 (555) 123-4567",
    defaultDeviceLimit: 1,
  },
  branding: {
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    logoUrl: "/logo.png",
    useDarkMode: true,
    useCustomFonts: false,
  },
  notifications: {
    emailNotifications: true,
    deviceOfflineAlerts: true,
    paymentReminders: true,
    newClientNotifications: true,
    systemUpdates: true,
  },
  security: {
    requireMfa: false,
    sessionTimeout: 30,
    passwordExpiration: 90,
    ipRestrictions: false,
  },
  email: {
    smtpServer: "smtp.example.com",
    smtpPort: 587,
    smtpUsername: "notifications@spear-tech.com",
    emailFromName: "SPEAR Support",
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleGeneralChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value
      }
    });
  };

  const handleBrandingChange = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      branding: {
        ...settings.branding,
        [field]: value
      }
    });
  };

  const handleNotificationToggle = (field: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field as keyof typeof settings.notifications]
      }
    });
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [field]: value
      }
    });
  };

  const handleEmailChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [field]: value
      }
    });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Settings saved successfully");

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure system-wide settings and preferences</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-md">
          {saveMessage}
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.general.companyName}
                  onChange={(e) => handleGeneralChange("companyName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={(e) => handleGeneralChange("supportEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={settings.general.supportPhone}
                  onChange={(e) => handleGeneralChange("supportPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultDeviceLimit">Default Device Limit</Label>
                <Input
                  id="defaultDeviceLimit"
                  type="number"
                  min="1"
                  value={settings.general.defaultDeviceLimit}
                  onChange={(e) => handleGeneralChange("defaultDeviceLimit", parseInt(e.target.value))}
                />
                <p className="text-sm text-slate-500">
                  Default number of devices allowed per client subscription
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <PaintBrushIcon className="h-5 w-5 mr-2" />
                Branding Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="text"
                    value={settings.branding.primaryColor}
                    onChange={(e) => handleBrandingChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: settings.branding.primaryColor }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accentColor"
                    type="text"
                    value={settings.branding.accentColor}
                    onChange={(e) => handleBrandingChange("accentColor", e.target.value)}
                    className="flex-1"
                  />
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: settings.branding.accentColor }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={settings.branding.logoUrl}
                  onChange={(e) => handleBrandingChange("logoUrl", e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Use Dark Mode by Default</Label>
                  <p className="text-sm text-slate-500">
                    Set dark mode as the default theme for all users
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.branding.useDarkMode}
                  onCheckedChange={(checked) => handleBrandingChange("useDarkMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="customFonts">Use Custom Fonts</Label>
                  <p className="text-sm text-slate-500">
                    Enable custom font settings for the application
                  </p>
                </div>
                <Switch
                  id="customFonts"
                  checked={settings.branding.useCustomFonts}
                  onCheckedChange={(checked) => handleBrandingChange("useCustomFonts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-slate-500">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deviceOfflineAlerts">Device Offline Alerts</Label>
                  <p className="text-sm text-slate-500">
                    Send alerts when devices go offline
                  </p>
                </div>
                <Switch
                  id="deviceOfflineAlerts"
                  checked={settings.notifications.deviceOfflineAlerts}
                  onCheckedChange={() => handleNotificationToggle("deviceOfflineAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReminders">Payment Reminders</Label>
                  <p className="text-sm text-slate-500">
                    Send payment reminder notifications
                  </p>
                </div>
                <Switch
                  id="paymentReminders"
                  checked={settings.notifications.paymentReminders}
                  onCheckedChange={() => handleNotificationToggle("paymentReminders")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newClientNotifications">New Client Notifications</Label>
                  <p className="text-sm text-slate-500">
                    Receive notifications when new clients sign up
                  </p>
                </div>
                <Switch
                  id="newClientNotifications"
                  checked={settings.notifications.newClientNotifications}
                  onCheckedChange={() => handleNotificationToggle("newClientNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemUpdates">System Update Notifications</Label>
                  <p className="text-sm text-slate-500">
                    Receive notifications about system updates
                  </p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={settings.notifications.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                Notification Testing
              </CardTitle>
              <CardDescription>
                Test notification functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationDemo />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireMfa">Require MFA</Label>
                  <p className="text-sm text-slate-500">
                    Require multi-factor authentication for all users
                  </p>
                </div>
                <Switch
                  id="requireMfa"
                  checked={settings.security.requireMfa}
                  onCheckedChange={(checked) => handleSecurityChange("requireMfa", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value))}
                />
                <p className="text-sm text-slate-500">
                  Time in minutes before an inactive session is logged out
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiration">Password Expiration (days)</Label>
                <Input
                  id="passwordExpiration"
                  type="number"
                  min="0"
                  value={settings.security.passwordExpiration}
                  onChange={(e) => handleSecurityChange("passwordExpiration", parseInt(e.target.value))}
                />
                <p className="text-sm text-slate-500">
                  Number of days before passwords expire (0 = never)
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ipRestrictions">IP Restrictions</Label>
                  <p className="text-sm text-slate-500">
                    Enable IP-based access restrictions
                  </p>
                </div>
                <Switch
                  id="ipRestrictions"
                  checked={settings.security.ipRestrictions}
                  onCheckedChange={(checked) => handleSecurityChange("ipRestrictions", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email server settings for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  value={settings.email.smtpServer}
                  onChange={(e) => handleEmailChange("smtpServer", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => handleEmailChange("smtpPort", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.email.smtpUsername}
                  onChange={(e) => handleEmailChange("smtpUsername", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value="••••••••••••"
                  onChange={() => {}}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFromName">From Name</Label>
                <Input
                  id="emailFromName"
                  value={settings.email.emailFromName}
                  onChange={(e) => handleEmailChange("emailFromName", e.target.value)}
                />
                <p className="text-sm text-slate-500">
                  Name that will appear in the From field of emails
                </p>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
