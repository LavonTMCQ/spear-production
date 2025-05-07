"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DevicePhoneMobileIcon, CreditCardIcon, ClockIcon, SignalIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { VRTitleSection } from "@/components/dashboard/vr-title-section";
import { ConnectionOverlay } from "@/components/dashboard/connection-overlay";
import { TeamViewerConnection } from "@/components/dashboard/teamviewer-connection";

// Mock data
const mockDevices = [
  {
    id: "1",
    name: "My Primary Device", // User-friendly custom name
    deviceModel: "Pixel 5",
    deviceId: "d12345", // Hidden connection ID (no TeamViewer branding)
    status: "online",
    lastCheckIn: "2023-04-15T12:00:00Z",
  },
  {
    id: "2",
    name: "Conference Room Device", // User-friendly custom name
    deviceModel: "Pixel 5",
    deviceId: "d67890", // Hidden connection ID (no TeamViewer branding)
    status: "online",
    lastCheckIn: "2023-04-14T15:30:00Z",
  },
];

const mockSubscription = {
  id: "1",
  status: "active", // Options: active, past_due, canceled, unpaid
  currentPeriodEnd: "2023-05-14T00:00:00Z",
  plan: "Basic Plan",
  price: "$350.00",
  devices: 1,
  paymentMethod: "Visa ending in 4242",
  lastPayment: "2023-04-14T00:00:00Z"
};

export default function DashboardPage() {
  const [isRemoteControlOpen, setIsRemoteControlOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  // Reset overlay when dialog closes
  useEffect(() => {
    if (!isRemoteControlOpen) {
      // Small delay to avoid flickering when reopening
      setTimeout(() => {
        setShowOverlay(true);
        setConnectionEstablished(false);
      }, 300);
    }
  }, [isRemoteControlOpen]);

  const handleConnect = (device: any) => {
    setSelectedDevice(device);
    setShowOverlay(true);
    setConnectionEstablished(false);
    setIsRemoteControlOpen(true);
  };

  const handleConnectionSuccess = () => {
    // In a real implementation, we would check if the device home screen is visible
    // For demo purposes, we'll keep the overlay visible to simulate waiting for home screen
    // The overlay component will handle showing appropriate messages
  };

  const handleRetry = () => {
    // Reset connection state
    setShowOverlay(true);
    setConnectionEstablished(false);

    // In a real implementation, we would attempt to reconnect to the device
    // For demo purposes, we'll just reset the state
  };

  return (
    <div className="space-y-6">
      <VRTitleSection />

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome to your remote control dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDevices.map((device) => (
          <Card key={device.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                {device.name}
              </CardTitle>
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
                  onClick={() => handleConnect(device)}
                >
                  Connect Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Subscription
            </CardTitle>
            <CardDescription className="flex items-center">
              <span className="text-green-500 font-medium flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                Active
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Plan</span>
                <span className="text-sm font-medium">{mockSubscription.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Monthly Price</span>
                <span className="text-sm font-medium">{mockSubscription.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Devices</span>
                <span className="text-sm font-medium">{mockSubscription.devices}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Payment Method</span>
                <span className="text-sm font-medium truncate max-w-[150px]">{mockSubscription.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Last Payment</span>
                <span className="text-sm font-medium">
                  {new Date(mockSubscription.lastPayment).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Next Billing Date</span>
                <span className="text-sm font-medium">
                  {new Date(mockSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-10" asChild>
              <Link href="/dashboard/subscription">
                Manage Subscription
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRemoteControlOpen} onOpenChange={setIsRemoteControlOpen}>
        <DialogContent className="max-w-5xl">
          {selectedDevice && (
            <TeamViewerConnection
              deviceId={selectedDevice.deviceId}
              deviceName={selectedDevice.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
