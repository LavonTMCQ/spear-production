"use client";

import { useState, useEffect } from "react";
import { DeviceProvisioning } from "@/components/admin/device-provisioning";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DevicePhoneMobileIcon, PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Mock data
const mockDevices = [
  {
    id: "1",
    name: "My Primary Device",
    deviceModel: "Pixel 5",
    deviceId: "d12345",
    assignedTo: {
      id: "1",
      name: "John Doe",
      email: "john@example.com"
    },
    status: "online",
    lastActive: "2023-04-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Conference Room Device",
    deviceModel: "Pixel 5",
    deviceId: "d67890",
    assignedTo: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    status: "offline",
    lastActive: "2023-04-14T15:30:00Z",
  },
  {
    id: "3",
    name: "Pixel 5 #003",
    deviceModel: "Pixel 5",
    deviceId: "d54321",
    assignedTo: null,
    status: "unassigned",
    lastActive: null,
  },
  {
    id: "4",
    name: "Pixel 5 #004",
    deviceModel: "Pixel 5",
    deviceId: "d98765",
    assignedTo: null,
    status: "unassigned",
    lastActive: null,
  },
];

const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc."
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "XYZ Corp"
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    company: "Johnson LLC"
  },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false);
  const [isAssignDeviceOpen, setIsAssignDeviceOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState("unassigned");
  const [newDeviceId, setNewDeviceId] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [activeClientFilter, setActiveClientFilter] = useState<string | null>(null);

  // Check for client filter in URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientId = params.get('client');
      if (clientId) {
        setActiveClientFilter(clientId);
        const client = mockClients.find(c => c.id === clientId);
        if (client) {
          setSearchTerm(client.name); // Set search term to client name
        }
      }
    }
  }, []);

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const handleViewDevice = (device: any) => {
    setSelectedDevice(device);
    setIsDeviceDetailsOpen(true);
  };

  const handleAssignDevice = (device: any) => {
    setSelectedDevice(device);
    setSelectedClientId(device.assignedTo?.id || "unassigned");
    setIsAssignDeviceOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedDevice) return;

    const selectedClient = selectedClientId && selectedClientId !== "unassigned"
      ? mockClients.find(client => client.id === selectedClientId)
      : null;

    setDevices(devices.map(device =>
      device.id === selectedDevice.id
        ? {
            ...device,
            assignedTo: selectedClient,
            status: selectedClient ? "offline" : "unassigned"
          }
        : device
    ));

    setIsAssignDeviceOpen(false);
  };

  const handleAddDevice = () => {
    if (!newDeviceId.trim() || !newDeviceName.trim()) return;

    const newDevice = {
      id: `${devices.length + 1}`,
      name: newDeviceName.trim(),
      deviceModel: "Pixel 5",
      deviceId: newDeviceId.trim(),
      assignedTo: null,
      status: "unassigned",
      lastActive: null,
    };

    setDevices([...devices, newDevice]);
    setNewDeviceId("");
    setNewDeviceName("");
    setIsAddDeviceOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "offline":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      case "unassigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your device inventory and assignments</p>
        </div>
        <Button onClick={() => setIsAddDeviceOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Device
        </Button>
      </div>

      <div className="mb-8">
        <DeviceProvisioning />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Devices in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <div className="h-5 w-5 mr-2 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
              </div>
              Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.filter(d => d.status === "online").length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Devices currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <div className="h-5 w-5 mr-2 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-slate-400"></span>
              </div>
              Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.filter(d => d.status === "offline").length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Devices currently offline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <div className="h-5 w-5 mr-2 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              </div>
              Unassigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.filter(d => d.status === "unassigned").length}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Devices not assigned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
            Device Inventory
          </CardTitle>
          <CardDescription>
            View and manage all devices and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 max-w-md">
              <Input
                placeholder="Search devices by name, ID, or assigned client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              {activeClientFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveClientFilter(null);
                    setSearchTerm('');
                    // Remove client param from URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete('client');
                    window.history.pushState({}, '', url);
                  }}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            {activeClientFilter && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Showing devices for client: <span className="font-medium">{mockClients.find(c => c.id === activeClientFilter)?.name}</span></p>
              </div>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.deviceModel}</TableCell>
                  <TableCell className="font-mono text-xs">{device.deviceId}</TableCell>
                  <TableCell>
                    {device.assignedTo ? (
                      <div className="flex flex-col">
                        <span>{device.assignedTo.name}</span>
                        <span className="text-xs text-slate-500">{device.assignedTo.email}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(device.status)}`}
                    >
                      {device.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {device.lastActive ? new Date(device.lastActive).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDevice(device)}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAssignDevice(device)}>
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDevices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No devices found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Device Details Dialog */}
      <Dialog open={isDeviceDetailsOpen} onOpenChange={setIsDeviceDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Device Details
            </DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-6 pt-2">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{selectedDevice.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedDevice.status)}`}
                  >
                    {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{selectedDevice.deviceModel}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Device ID</span>
                  <span className="font-mono text-sm">{selectedDevice.deviceId}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Assigned To</span>
                  {selectedDevice.assignedTo ? (
                    <div>
                      <span className="font-medium">{selectedDevice.assignedTo.name}</span>
                      <div className="text-xs text-slate-500 mt-0.5">{selectedDevice.assignedTo.email}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400">Not assigned to any client</span>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Last Activity</span>
                  {selectedDevice.lastActive ? (
                    <span className="font-medium">{new Date(selectedDevice.lastActive).toLocaleString()}</span>
                  ) : (
                    <span className="text-slate-400">No activity recorded</span>
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center border-t pt-6">
                <Button variant="outline" onClick={() => handleAssignDevice(selectedDevice)}>
                  Reassign Device
                </Button>
                <Button variant="outline" className="flex items-center">
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Device Dialog */}
      <Dialog open={isAssignDeviceOpen} onOpenChange={setIsAssignDeviceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Assign Device
            </DialogTitle>
            <DialogDescription className="mt-1.5">
              Select a client to assign this device to
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-6 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Device Name</span>
                  <span className="font-medium">{selectedDevice.name}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Device ID</span>
                  <span className="font-mono text-sm">{selectedDevice.deviceId}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500">Current Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${getStatusBadgeClass(selectedDevice.status)}`}
                  >
                    {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="client" className="text-sm font-medium">Assign to Client</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger id="client" className="h-10">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassign Device</SelectItem>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.company})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-800 dark:text-blue-300">
                  {selectedClientId
                    ? "This device will be assigned to the selected client and will appear in their dashboard."
                    : "This device will be unassigned and removed from any client's dashboard."
                  }
                </div>
              </div>

              <DialogFooter className="border-t pt-6">
                <div className="flex space-x-3 w-full justify-end">
                  <Button variant="outline" onClick={() => setIsAssignDeviceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAssignment}>
                    Save Assignment
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Add New Device
            </DialogTitle>
            <DialogDescription className="mt-1.5">
              Register a new device in the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <Label htmlFor="deviceId" className="text-sm font-medium">Device ID</Label>
              <Input
                id="deviceId"
                placeholder="Enter the device connection ID"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                className="h-10"
              />
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md text-xs text-slate-600 dark:text-slate-400">
                This is the unique identifier used to connect to the device. For security reasons, this ID should be kept confidential.
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="deviceName" className="text-sm font-medium">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="Enter a name for this device"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                className="h-10"
              />
              <div className="text-xs text-slate-500">
                This name will be visible to administrators and clients. Choose a descriptive name that helps identify the device.
              </div>
            </div>

            <DialogFooter className="border-t pt-6">
              <div className="flex space-x-3 w-full justify-end">
                <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} disabled={!newDeviceId.trim() || !newDeviceName.trim()}>
                  Add Device
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
