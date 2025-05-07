"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowPathIcon, DocumentDuplicateIcon, UserPlusIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

export function BulkDeviceOperations() {
  const [activeTab, setActiveTab] = useState("import");
  const [importText, setImportText] = useState("");
  const [clientId, setClientId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

  // Mock client data
  const mockClients = [
    { id: "client1", name: "Acme Corporation" },
    { id: "client2", name: "TechStart Inc" },
    { id: "client3", name: "Global Solutions Ltd" },
  ];

  const handleImportDevices = () => {
    if (!importText.trim()) {
      setResult({
        success: false,
        message: "Please enter device IDs to import",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const deviceIds = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      setResult({
        success: true,
        message: `Successfully imported ${deviceIds.length} devices`,
        details: `Device IDs: ${deviceIds.join(", ")}`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleAssignDevices = () => {
    if (!importText.trim() || !clientId) {
      setResult({
        success: false,
        message: "Please enter device IDs and select a client",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const deviceIds = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const client = mockClients.find(c => c.id === clientId);

      setResult({
        success: true,
        message: `Successfully assigned ${deviceIds.length} devices to ${client?.name}`,
        details: `Device IDs: ${deviceIds.join(", ")}`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleRevokeAccess = () => {
    if (!importText.trim()) {
      setResult({
        success: false,
        message: "Please enter device IDs to revoke access",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const deviceIds = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      setResult({
        success: true,
        message: `Successfully revoked access for ${deviceIds.length} devices`,
        details: `Device IDs: ${deviceIds.join(", ")}`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleSyncDevices = () => {
    if (!importText.trim()) {
      setResult({
        success: false,
        message: "Please enter device IDs to sync",
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const deviceIds = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      setResult({
        success: true,
        message: `Successfully synced ${deviceIds.length} devices with TeamViewer`,
        details: `Device IDs: ${deviceIds.join(", ")}`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleAction = () => {
    switch (activeTab) {
      case "import":
        handleImportDevices();
        break;
      case "assign":
        handleAssignDevices();
        break;
      case "revoke":
        handleRevokeAccess();
        break;
      case "sync":
        handleSyncDevices();
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bulk Device Operations</CardTitle>
        <CardDescription>
          Perform operations on multiple devices at once
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="import" className="flex items-center">
              <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="assign" className="flex items-center">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Assign
            </TabsTrigger>
            <TabsTrigger value="revoke" className="flex items-center">
              <NoSymbolIcon className="h-4 w-4 mr-2" />
              Revoke
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Sync
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceIds">
                {activeTab === "import" && "Device IDs to Import"}
                {activeTab === "assign" && "Device IDs to Assign"}
                {activeTab === "revoke" && "Device IDs to Revoke Access"}
                {activeTab === "sync" && "Device IDs to Sync"}
              </Label>
              <Textarea
                id="deviceIds"
                placeholder="Enter one device ID per line"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-slate-500">
                Enter one device ID per line. You can paste multiple IDs at once.
              </p>
            </div>

            {activeTab === "assign" && (
              <div className="space-y-2">
                <Label htmlFor="clientSelect">Assign to Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="clientSelect">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {result && (
              <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                <p className="font-medium">{result.message}</p>
                {result.details && (
                  <p className="text-sm mt-1">{result.details}</p>
                )}
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleAction}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {activeTab === "import" && "Import Devices"}
              {activeTab === "assign" && "Assign Devices"}
              {activeTab === "revoke" && "Revoke Access"}
              {activeTab === "sync" && "Sync Devices"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
