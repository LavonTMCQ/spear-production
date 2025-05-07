"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DevicePhoneMobileIcon, PencilIcon, ClockIcon, SignalIcon, PlusIcon } from "@heroicons/react/24/outline";

// Mock data
const mockDevices = [
  {
    id: "1",
    name: "My Primary Device",
    deviceModel: "Pixel 5",
    deviceId: "d12345",
    status: "online",
    lastCheckIn: "2023-04-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Conference Room Device",
    deviceModel: "Pixel 5",
    deviceId: "d67890",
    status: "online",
    lastCheckIn: "2023-04-14T15:30:00Z",
  },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState(mockDevices);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [newDeviceName, setNewDeviceName] = useState("");

  const handleEditDevice = (device: any) => {
    setCurrentDevice(device);
    setNewDeviceName(device.name);
    setIsEditDialogOpen(true);
  };

  const handleSaveDeviceName = () => {
    if (!currentDevice || !newDeviceName.trim()) return;
    
    // Update device name in our state
    setDevices(devices.map(device => 
      device.id === currentDevice.id 
        ? { ...device, name: newDeviceName.trim() } 
        : device
    ));
    
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Devices</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your connected devices</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                  {device.name}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => handleEditDevice(device)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="flex items-center">
                <span className="text-xs text-slate-500">{device.deviceModel}</span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="text-green-500 font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                  Online
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pt-1">
                <div className="flex items-center text-sm text-slate-500">
                  <SignalIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">Connection Status:</span>
                  <span className="ml-2 text-green-500 font-medium">Ready</span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Last Activity:</span>
                  <span className="ml-2">{new Date(device.lastCheckIn).toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  className="w-full h-10 font-medium"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Connect Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Device Card - Only show if subscription allows */}
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center h-full py-10">
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-4">
              <PlusIcon className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">Add New Device</h3>
            <p className="text-sm text-slate-500 text-center mb-4">
              Contact support to add another device to your subscription
            </p>
            <Button variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Device Name Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Device</DialogTitle>
            <DialogDescription>
              Give your device a name that helps you identify it easily.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input 
                id="deviceName" 
                value={newDeviceName} 
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="Enter a name for this device"
              />
            </div>
            <div className="text-sm text-slate-500">
              <p>Device ID: {currentDevice?.deviceId}</p>
              <p>Model: {currentDevice?.deviceModel}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDeviceName}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
