"use client";

import { useState, useEffect } from "react";
import { BulkDeviceOperations } from "@/components/admin/bulk-device-operations";
import { getTeamViewerConfig, isTeamViewerConfigured } from "@/lib/teamviewer-config";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LinkIcon, KeyIcon, ShieldCheckIcon, GlobeAltIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Default TeamViewer integration data
const defaultTeamViewerConfig = {
  connected: true,
  clientId: "",
  clientSecret: "",
  redirectUri: "",
  allowlistedDomains: ["spear-app.vercel.app", "localhost:3000"],
  lastSyncTime: new Date().toISOString(),
};

// Mock connection logs
const mockConnectionLogs = [
  {
    id: "log1",
    timestamp: "2023-11-15T14:30:00Z",
    event: "API Authentication",
    status: "success",
    details: "Successfully authenticated with TeamViewer API",
  },
  {
    id: "log2",
    timestamp: "2023-11-15T14:25:00Z",
    event: "Device Sync",
    status: "success",
    details: "Synchronized 15 devices from TeamViewer",
  },
  {
    id: "log3",
    timestamp: "2023-11-14T09:15:00Z",
    event: "User Creation",
    status: "success",
    details: "Created TeamViewer user for client: Acme Corp",
  },
  {
    id: "log4",
    timestamp: "2023-11-13T16:45:00Z",
    event: "Access Revocation",
    status: "success",
    details: "Revoked access for expired subscription: TechStart Inc",
  },
  {
    id: "log5",
    timestamp: "2023-11-12T11:20:00Z",
    event: "API Authentication",
    status: "failed",
    details: "Authentication failed: Invalid client credentials",
  },
];

export default function IntegrationsPage() {
  const [config, setConfig] = useState(defaultTeamViewerConfig);

  // Load TeamViewer config from environment variables if available
  useEffect(() => {
    const tvConfig = getTeamViewerConfig();
    if (isTeamViewerConfigured()) {
      setConfig({
        ...config,
        clientId: tvConfig.clientId,
        clientSecret: "••••••••••••••••", // Mask the secret
        redirectUri: tvConfig.redirectUri,
        connected: true,
      });
    }
  }, []);
  const [logs, setLogs] = useState(mockConnectionLogs);
  const [newDomain, setNewDomain] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveConfig = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("TeamViewer configuration saved successfully");

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }, 1000);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);

    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);

      // Add a new log entry
      const newLog = {
        id: `log${logs.length + 1}`,
        timestamp: new Date().toISOString(),
        event: "Manual Sync",
        status: "success",
        details: "Manual synchronization completed successfully",
      };

      setLogs([newLog, ...logs]);

      // Update last sync time
      setConfig({
        ...config,
        lastSyncTime: new Date().toISOString(),
      });
    }, 2000);
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;

    setConfig({
      ...config,
      allowlistedDomains: [...config.allowlistedDomains, newDomain.trim()],
    });

    setNewDomain("");
  };

  const handleRemoveDomain = (domain: string) => {
    setConfig({
      ...config,
      allowlistedDomains: config.allowlistedDomains.filter(d => d !== domain),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">TeamViewer Integration</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your TeamViewer API integration and device connections</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-md">
          {saveMessage}
        </div>
      )}

      <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
        <div className={`h-3 w-3 rounded-full ${config.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">
          {config.connected ? 'Connected to TeamViewer API' : 'Not connected to TeamViewer API'}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-sm">
          Last synchronized: {formatDate(config.lastSyncTime)}
        </span>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="configuration">API Configuration</TabsTrigger>
          <TabsTrigger value="domains">Allowlisted Domains</TabsTrigger>
          <TabsTrigger value="logs">Connection Logs</TabsTrigger>
        </TabsList>

        {/* API Configuration */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <KeyIcon className="h-5 w-5 mr-2" />
                TeamViewer API Credentials
              </CardTitle>
              <CardDescription>
                Configure your TeamViewer API credentials for integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <div className="flex space-x-2">
                  <Input
                    id="clientSecret"
                    type="password"
                    value={config.clientSecret}
                    onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                  />
                  <Button variant="outline" size="sm">
                    Show
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectUri">Redirect URI</Label>
                <Input
                  id="redirectUri"
                  value={config.redirectUri}
                  onChange={(e) => setConfig({ ...config, redirectUri: e.target.value })}
                />
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md text-sm text-amber-800 dark:text-amber-400 mt-4">
                <p className="font-medium">Important</p>
                <p className="mt-1">
                  These credentials are used to authenticate with the TeamViewer API. Make sure to keep them secure and never expose them in client-side code.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                Connection Settings
              </CardTitle>
              <CardDescription>
                Configure how SPEAR connects to TeamViewer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSync">Automatic Synchronization</Label>
                  <p className="text-sm text-slate-500">
                    Automatically sync devices and users with TeamViewer
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRevoke">Automatic Access Revocation</Label>
                  <p className="text-sm text-slate-500">
                    Automatically revoke TeamViewer access when subscriptions expire
                  </p>
                </div>
                <Switch
                  id="autoRevoke"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="embedSessions">Embed Remote Sessions</Label>
                  <p className="text-sm text-slate-500">
                    Embed TeamViewer sessions in SPEAR interface using iframes
                  </p>
                </div>
                <Switch
                  id="embedSessions"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allowlisted Domains */}
        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                Allowlisted Domains
              </CardTitle>
              <CardDescription>
                Manage domains that are allowed to embed TeamViewer sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter domain (e.g., example.com)"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <Button onClick={handleAddDomain}>Add Domain</Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.allowlistedDomains.map((domain) => (
                      <TableRow key={domain}>
                        <TableCell>{domain}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDomain(domain)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md text-sm text-blue-800 dark:text-blue-400 mt-2">
                <p className="font-medium">Note</p>
                <p className="mt-1">
                  TeamViewer requires domains to be allowlisted before they can embed sessions in iframes. Add all domains where SPEAR will be hosted.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Connection Logs
              </CardTitle>
              <CardDescription>
                View logs of TeamViewer API interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell>{log.event}</TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Success
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 dark:text-red-400">
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Failed
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                Export Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <BulkDeviceOperations />
      </div>
    </div>
  );
}
