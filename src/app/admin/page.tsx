"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UsersIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import { TeamViewerApiStatus } from "@/components/admin/teamviewer-api-status";
import { isTeamViewerConfigured } from "@/lib/teamviewer-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VRTitleSection } from "@/components/dashboard/vr-title-section";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminTitle } from "@/components/admin/admin-title";
import { SectionTitle } from "@/components/admin/section-title";

// Mock data
const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    subscription: {
      status: "active",
      currentPeriodEnd: "2023-05-15T00:00:00Z",
    },
    devices: 1,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    subscription: {
      status: "past_due",
      currentPeriodEnd: "2023-04-10T00:00:00Z",
    },
    devices: 2,
  },
];

const mockDevices = [
  {
    id: "1",
    name: "My Primary Device", // User-friendly custom name
    deviceModel: "Pixel 5",
    deviceId: "d12345", // Hidden connection ID (no TeamViewer branding)
    assignedTo: "John Doe",
    status: "online",
    lastActive: "2023-04-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Conference Room Device", // User-friendly custom name
    deviceModel: "Pixel 5",
    deviceId: "d67890", // Hidden connection ID (no TeamViewer branding)
    assignedTo: "Jane Smith",
    status: "offline",
    lastActive: "2023-04-14T15:30:00Z",
  },
  {
    id: "3",
    name: "Pixel 5 #003", // Default name for unassigned device
    deviceModel: "Pixel 5",
    deviceId: "d54321", // Hidden connection ID (no TeamViewer branding)
    assignedTo: null,
    status: "unassigned",
    lastActive: null,
  },
];

export default function AdminDashboardPage() {
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isTeamViewerReady, setIsTeamViewerReady] = useState(false);

  // Check if TeamViewer is configured
  useEffect(() => {
    // This runs on the client side after hydration
    setIsTeamViewerReady(isTeamViewerConfigured());
  }, []);

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsClientDetailsOpen(true);
  };

  const handleManageClient = (client: any) => {
    // Navigate to clients page
    window.location.href = `/admin/clients?client=${client.id}`;
  };

  return (
    <div className="space-y-6">
      <VRTitleSection />

      <AdminTitle />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 bg-slate-900/40">
          <CardHeader className="pb-0 pt-5">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-5">
            <div className="text-4xl font-bold">{mockClients.length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total clients</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 bg-slate-900/40">
          <CardHeader className="pb-0 pt-5">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-5">
            <div className="text-4xl font-bold">{mockDevices.length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total devices</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 bg-slate-900/40">
          <CardHeader className="pb-0 pt-5">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                <CreditCardIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-5">
            <div className="text-4xl font-bold">
              {mockClients.filter(c => c.subscription.status === "active").length}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Paying clients</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 bg-slate-900/40">
          <CardHeader className="pb-0 pt-5">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg mr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              Past Due
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-5">
            <div className="text-4xl font-bold text-amber-500">
              {mockClients.filter(c => c.subscription.status === "past_due").length}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
          <SectionTitle title="Recent Clients" viewAllLink="/admin/clients" />
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Email</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Renewal Date</TableHead>
                    <TableHead className="font-medium">Devices</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            client.subscription.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          {client.subscription.status.charAt(0).toUpperCase() + client.subscription.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(client.subscription.currentPeriodEnd).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>{client.devices}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => handleViewClient(client)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => handleManageClient(client)}
                          >
                            Manage
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>

          <div>
          <SectionTitle title="Recent Devices" viewAllLink="/admin/devices" />
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                    <TableHead className="font-medium">Device Name</TableHead>
                    <TableHead className="font-medium">Model</TableHead>
                    <TableHead className="font-medium">Device ID</TableHead>
                    <TableHead className="font-medium">Assigned To</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDevices.map((device) => (
                    <TableRow key={device.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.deviceModel}</TableCell>
                      <TableCell className="font-mono text-xs">{device.deviceId}</TableCell>
                      <TableCell>
                        {device.assignedTo || <span className="text-slate-400">Unassigned</span>}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            device.status === "online"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : device.status === "offline"
                              ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => window.location.href = `/admin/devices?device=${device.id}`}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 bg-slate-900/40">
            <CardHeader className="pb-0 pt-5">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3">
                  <LinkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                TeamViewer Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full ${isTeamViewerReady ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></span>
                    <span className="text-sm font-medium">{isTeamViewerReady ? 'Connected' : 'Configuration Needed'}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last synced: {new Date().toLocaleString()}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/admin/integrations'}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          <TeamViewerApiStatus />


        </div>
      </div>

      {/* Client Details Dialog */}
      <Dialog open={isClientDetailsOpen} onOpenChange={setIsClientDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold">
              Client Details
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Client Information</h3>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Full Name</span>
                      <span className="font-medium">{selectedClient.name}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Email Address</span>
                      <span className="font-medium">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Subscription Details</h3>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Status</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                          selectedClient.subscription.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {selectedClient.subscription.status === "active" ? "Active" : "Past Due"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Next Billing Date</span>
                      <span className="font-medium">{new Date(selectedClient.subscription.currentPeriodEnd).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Devices</span>
                      <span className="font-medium">{selectedClient.devices} {selectedClient.devices === 1 ? "Device" : "Devices"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center border-t pt-6">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsClientDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsClientDetailsOpen(false);
                      handleManageClient(selectedClient);
                    }}
                  >
                    Manage Client
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
