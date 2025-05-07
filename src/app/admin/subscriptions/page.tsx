"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UnifiedSubscriptionManagement } from "@/components/admin/unified-subscription-management";

// Mock client data
const mockClients = [
  {
    id: "client1",
    name: "Acme Corporation",
    service: "teamviewer",
    plan: "enterprise",
    status: "active",
    expires: "2023-12-31",
    devices: 42
  },
  {
    id: "client2",
    name: "TechStart Inc",
    service: "teamviewer",
    plan: "professional",
    status: "active",
    expires: "2023-10-15",
    devices: 18
  },
  {
    id: "client3",
    name: "Global Solutions Ltd",
    service: "teamviewer",
    plan: "basic",
    status: "active",
    expires: "2023-11-20",
    devices: 5
  },
  {
    id: "client4",
    name: "Innovative Systems",
    service: "teamviewer",
    plan: "enterprise",
    status: "active",
    expires: "2024-02-10",
    devices: 31
  },
  {
    id: "client5",
    name: "Digital Dynamics",
    service: "teamviewer",
    plan: "professional",
    status: "expired",
    expires: "2023-05-22",
    devices: 12
  }
];

export default function SubscriptionsPage() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const handleManageSubscription = (client: any) => {
    setSelectedClient(client);
    setIsManageDialogOpen(true);
  };

  const getServiceIcon = (service: string) => {
    if (service === "teamviewer") {
      return (
        <img
          src="/images/teamviewer-logo.png"
          alt="TeamViewer"
          className="h-5 w-5"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remote Access Subscriptions</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage client subscriptions for remote access services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Client Subscriptions</CardTitle>
          <CardDescription>
            View and manage remote access service subscriptions for all clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getServiceIcon(client.service)}
                        <span className="ml-2">
                          TeamViewer
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{client.plan}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.expires}</TableCell>
                    <TableCell>{client.devices}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageSubscription(client)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Update the remote access subscription for {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <UnifiedSubscriptionManagement
              clientId={selectedClient.id}
              clientName={selectedClient.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
