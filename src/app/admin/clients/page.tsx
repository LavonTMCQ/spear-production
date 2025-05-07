"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UsersIcon, PlusIcon, ExclamationCircleIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

// Mock data
const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567",
    subscription: {
      id: "sub_123456",
      status: "active",
      currentPeriodEnd: "2023-05-15T00:00:00Z",
      plan: "Basic Plan",
      price: "$350.00",
    },
    devices: [
      {
        id: "d1",
        name: "My Primary Device",
        deviceModel: "Pixel 5",
        deviceId: "d12345",
        status: "online",
      }
    ],
    createdAt: "2022-04-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "XYZ Corp",
    phone: "+1 (555) 987-6543",
    subscription: {
      id: "sub_789012",
      status: "past_due",
      currentPeriodEnd: "2023-04-10T00:00:00Z",
      plan: "Basic Plan + 1 Additional Device",
      price: "$650.00",
    },
    devices: [
      {
        id: "d2",
        name: "Conference Room Device",
        deviceModel: "Pixel 5",
        deviceId: "d67890",
        status: "offline",
      },
      {
        id: "d3",
        name: "Jane's Device",
        deviceModel: "Pixel 5",
        deviceId: "d54321",
        status: "online",
      }
    ],
    createdAt: "2022-03-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    company: "Johnson LLC",
    phone: "+1 (555) 456-7890",
    subscription: {
      id: "sub_345678",
      status: "canceled",
      currentPeriodEnd: "2023-03-01T00:00:00Z",
      plan: "Basic Plan",
      price: "$350.00",
    },
    devices: [],
    createdAt: "2022-01-05T00:00:00Z",
  },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isConfirmRevokeOpen, setIsConfirmRevokeOpen] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsClientDetailsOpen(true);
  };

  const handleRevokeAccess = () => {
    // In a real implementation, this would call the API to revoke access
    // For now, we'll just update the UI
    if (!selectedClient) return;

    setClients(clients.map(client =>
      client.id === selectedClient.id
        ? {
            ...client,
            subscription: {
              ...client.subscription,
              status: "canceled"
            },
            devices: client.devices.map(device => ({
              ...device,
              status: "unassigned"
            }))
          }
        : client
    ));

    setIsConfirmRevokeOpen(false);
    // Update the selected client to reflect changes
    setSelectedClient({
      ...selectedClient,
      subscription: {
        ...selectedClient.subscription,
        status: "canceled"
      },
      devices: selectedClient.devices.map((device: any) => ({
        ...device,
        status: "unassigned"
      }))
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "past_due":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "canceled":
      case "unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your clients and their subscriptions</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            Client Management
          </CardTitle>
          <CardDescription>
            View and manage all clients and their subscription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search clients by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Subscription Status</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(client.subscription.status)}`}
                    >
                      {client.subscription.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {client.subscription.status !== "canceled"
                      ? new Date(client.subscription.currentPeriodEnd).toLocaleDateString()
                      : "—"
                    }
                  </TableCell>
                  <TableCell>{client.devices.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleViewClient(client);
                          // Focus on the Manage Devices button after dialog opens
                          setTimeout(() => {
                            const manageDevicesBtn = document.querySelector('[data-manage-devices]') as HTMLButtonElement;
                            if (manageDevicesBtn) manageDevicesBtn.focus();
                          }, 100);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No clients found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={isClientDetailsOpen} onOpenChange={setIsClientDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Client Details
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-8 pt-2">
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
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Company</span>
                      <span className="font-medium">{selectedClient.company}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Phone Number</span>
                      <span className="font-medium">{selectedClient.phone}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Client Since</span>
                      <span className="font-medium">{new Date(selectedClient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Subscription Details</h3>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Status</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${getStatusBadgeClass(selectedClient.subscription.status)}`}
                      >
                        {selectedClient.subscription.status.charAt(0).toUpperCase() + selectedClient.subscription.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Plan</span>
                      <span className="font-medium">{selectedClient.subscription.plan}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Monthly Price</span>
                      <span className="font-medium">{selectedClient.subscription.price}</span>
                    </div>
                    {selectedClient.subscription.status !== "canceled" && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500">Next Billing Date</span>
                        <span className="font-medium">{new Date(selectedClient.subscription.currentPeriodEnd).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-500">Subscription ID</span>
                      <span className="font-mono text-xs">{selectedClient.subscription.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Devices ({selectedClient.devices.length})</h3>
                {selectedClient.devices.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device Name</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Device ID</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClient.devices.map((device: any) => (
                          <TableRow key={device.id}>
                            <TableCell className="font-medium">{device.name}</TableCell>
                            <TableCell>{device.deviceModel}</TableCell>
                            <TableCell className="font-mono text-xs">{device.deviceId}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  device.status === "online"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : device.status === "offline"
                                    ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p>No devices assigned to this client</p>
                    <p className="text-sm mt-1">Assign devices from the Devices management page</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between items-center border-t pt-6">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // In a real app, this would navigate to an edit form
                      window.alert(`Edit client: ${selectedClient.name}`);
                    }}
                  >
                    Edit Client
                  </Button>
                  <Button
                    data-manage-devices
                    onClick={() => {
                      // Close the current dialog
                      setIsClientDetailsOpen(false);
                      // Navigate to devices page with client filter
                      window.location.href = `/admin/devices?client=${selectedClient.id}`;
                    }}
                  >
                    Manage Devices
                  </Button>
                </div>
                {selectedClient.subscription.status !== "canceled" && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsConfirmRevokeOpen(true)}
                  >
                    Revoke Access
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Revoke Access Dialog */}
      <Dialog open={isConfirmRevokeOpen} onOpenChange={setIsConfirmRevokeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              Revoke Client Access
            </DialogTitle>
            <DialogDescription>
              This action will cancel the client's subscription and revoke access to all devices.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-md text-sm text-red-800 dark:text-red-300 space-y-2">
              <p>The following actions will occur:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Client subscription will be canceled immediately</li>
                <li>All device connections will be terminated</li>
                <li>Client will lose access to the dashboard</li>
              </ul>
              <p className="font-medium">This action cannot be undone.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmRevokeOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAccess}>
              Confirm Revocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
