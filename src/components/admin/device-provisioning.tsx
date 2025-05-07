"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowPathIcon, QrCodeIcon, DevicePhoneMobileIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export function DeviceProvisioning() {
  const [activeTab, setActiveTab] = useState("manual");
  const [deviceName, setDeviceName] = useState("");
  const [deviceModel, setDeviceModel] = useState("pixel5");
  const [clientId, setClientId] = useState("unassigned");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningResult, setProvisioningResult] = useState<{ success: boolean; message: string; deviceId?: string } | null>(null);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  // Mock client data
  const mockClients = [
    { id: "client1", name: "Acme Corporation" },
    { id: "client2", name: "TechStart Inc" },
    { id: "client3", name: "Global Solutions Ltd" },
  ];

  const handleProvisionDevice = () => {
    if (!deviceName.trim()) {
      setProvisioningResult({
        success: false,
        message: "Please enter a device name",
      });
      return;
    }

    setIsProvisioning(true);
    setProvisioningResult(null);

    // Simulate API call
    setTimeout(() => {
      const deviceId = `d${Math.random().toString().substring(2, 7)}`;

      setProvisioningResult({
        success: true,
        message: "Device provisioned successfully",
        deviceId,
      });

      setIsProvisioning(false);
    }, 2000);
  };

  const handleGenerateQRCode = () => {
    if (!deviceName.trim()) {
      setProvisioningResult({
        success: false,
        message: "Please enter a device name",
      });
      return;
    }

    setIsProvisioning(true);
    setProvisioningResult(null);
    setQrCodeGenerated(false);

    // Simulate API call
    setTimeout(() => {
      const deviceId = `d${Math.random().toString().substring(2, 7)}`;

      setProvisioningResult({
        success: true,
        message: "QR code generated successfully",
        deviceId,
      });

      setQrCodeGenerated(true);
      setIsProvisioning(false);
    }, 2000);
  };

  const handleBulkProvision = () => {
    setIsProvisioning(true);
    setProvisioningResult(null);

    // Simulate API call
    setTimeout(() => {
      setProvisioningResult({
        success: true,
        message: "5 devices provisioned successfully",
      });

      setIsProvisioning(false);
    }, 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Device Provisioning</CardTitle>
        <CardDescription>
          Provision new devices for TeamViewer remote control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="manual" className="flex items-center">
              <DevicePhoneMobileIcon className="h-4 w-4 mr-2" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="flex items-center">
              <QrCodeIcon className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center">
              <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
              Bulk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="Enter a name for the device"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceModel">Device Model</Label>
              <Select value={deviceModel} onValueChange={setDeviceModel}>
                <SelectTrigger id="deviceModel">
                  <SelectValue placeholder="Select device model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pixel5">Pixel 5</SelectItem>
                  <SelectItem value="pixel6">Pixel 6</SelectItem>
                  <SelectItem value="pixel7">Pixel 7</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSelect">Assign to Client (Optional)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="clientSelect">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {provisioningResult && (
              <div className={`p-3 rounded-md ${provisioningResult.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                <p className="font-medium">{provisioningResult.message}</p>
                {provisioningResult.deviceId && (
                  <p className="text-sm mt-1">Device ID: {provisioningResult.deviceId}</p>
                )}
              </div>
            )}

            <Button
              onClick={handleProvisionDevice}
              disabled={isProvisioning}
              className="w-full"
            >
              {isProvisioning ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Provisioning...
                </>
              ) : (
                "Provision Device"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="qrcode" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qrDeviceName">Device Name</Label>
              <Input
                id="qrDeviceName"
                placeholder="Enter a name for the device"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qrDeviceModel">Device Model</Label>
              <Select value={deviceModel} onValueChange={setDeviceModel}>
                <SelectTrigger id="qrDeviceModel">
                  <SelectValue placeholder="Select device model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pixel5">Pixel 5</SelectItem>
                  <SelectItem value="pixel6">Pixel 6</SelectItem>
                  <SelectItem value="pixel7">Pixel 7</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {qrCodeGenerated ? (
              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-md mb-4">
                  {/* Simulated QR code */}
                  <div className="w-48 h-48 bg-white dark:bg-black p-4 flex items-center justify-center">
                    <div className="w-40 h-40 grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${Math.random() > 0.5 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Scan this QR code with the device to complete setup
                </p>
                <Button variant="outline" size="sm" onClick={() => setQrCodeGenerated(false)}>
                  Generate New Code
                </Button>
              </div>
            ) : (
              <>
                {provisioningResult && (
                  <div className={`p-3 rounded-md ${provisioningResult.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    <p className="font-medium">{provisioningResult.message}</p>
                    {provisioningResult.deviceId && (
                      <p className="text-sm mt-1">Device ID: {provisioningResult.deviceId}</p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleGenerateQRCode}
                  disabled={isProvisioning}
                  className="w-full"
                >
                  {isProvisioning ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkConfig">Bulk Configuration</Label>
              <Textarea
                id="bulkConfig"
                placeholder="Enter one device per line in format: name,model"
                className="min-h-[120px]"
                defaultValue="Pixel 5 #001,pixel5\nPixel 5 #002,pixel5\nPixel 5 #003,pixel5\nPixel 5 #004,pixel5\nPixel 5 #005,pixel5"
              />
              <p className="text-xs text-slate-500">
                Format: device_name,device_model (one per line)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulkClientSelect">Assign to Client (Optional)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="bulkClientSelect">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {provisioningResult && (
              <div className={`p-3 rounded-md ${provisioningResult.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                <p className="font-medium">{provisioningResult.message}</p>
              </div>
            )}

            <Button
              onClick={handleBulkProvision}
              disabled={isProvisioning}
              className="w-full"
            >
              {isProvisioning ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Provisioning...
                </>
              ) : (
                "Provision Devices"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
