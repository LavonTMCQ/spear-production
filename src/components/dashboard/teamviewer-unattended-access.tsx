"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  getUnattendedDevices,
  TeamViewerUnattendedDevice,
  connectToUnattendedDevice
} from "@/lib/teamviewer-unattended";

interface TeamViewerUnattendedAccessProps {
  onDeviceConnect?: (deviceId: string, deviceName: string) => void;
}

export function TeamViewerUnattendedAccess({ onDeviceConnect }: TeamViewerUnattendedAccessProps) {
  const [devices, setDevices] = useState<TeamViewerUnattendedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualDeviceId, setManualDeviceId] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<TeamViewerUnattendedDevice | null>(null);

  // Fetch unattended devices
  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const unattendedDevices = await getUnattendedDevices();
      setDevices(unattendedDevices);
    } catch (err) {
      console.error("Error fetching unattended devices:", err);
      setError("Failed to fetch unattended devices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Connect to a device
  const handleConnectToDevice = async (device: TeamViewerUnattendedDevice) => {
    setSelectedDevice(device);
    setIsConnecting(true);
    setError(null);

    try {
      console.log(`Connecting to device: ${device.name} (ID: ${device.id}, Remote ID: ${device.deviceId})`);
      const result = await connectToUnattendedDevice(device.id);

      // Format the device ID by removing spaces if present
      const formattedDeviceId = result.deviceId.replace(/\s+/g, '');

      // Show guidance message
      if (device.supportsUnattended) {
        alert(`Connecting to unattended device ${device.name} (ID: ${formattedDeviceId}). TeamViewer should open automatically.`);
      } else {
        alert(`Connecting to device ${device.name} (ID: ${formattedDeviceId}). TeamViewer should open automatically. You will need to accept the connection on the device.`);
      }

      // Try to launch TeamViewer client first
      if (result.password) {
        // If we have a password (unattended access), use it
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} and password`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}&p=${result.password}`;
      } else {
        // For direct connection without password
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} (direct connection)`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;
      }

      // Fallback to web client after a short delay
      setTimeout(() => {
        // For web client, use the connection URL from the result
        console.log(`Opening web client fallback: ${result.connectionUrl}`);
        window.open(result.connectionUrl, '_blank');
      }, 1500);

      // Notify parent component if callback provided
      if (onDeviceConnect) {
        onDeviceConnect(device.deviceId, device.name);
      }
    } catch (err) {
      console.error("Error connecting to unattended device:", err);
      setError("Failed to connect to unattended device. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to a device manually using ID and password
  const handleManualConnect = () => {
    if (!manualDeviceId.trim()) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Format the device ID by removing spaces if present
      const formattedDeviceId = manualDeviceId.replace(/\s+/g, '');

      // Show guidance message
      if (manualPassword.trim()) {
        alert(`Connecting to device with ID: ${formattedDeviceId} using provided password. TeamViewer should open automatically.`);
      } else {
        alert(`Connecting to device with ID: ${formattedDeviceId}. You will need to accept the connection on the device. TeamViewer should open automatically.`);
      }

      // Try to launch TeamViewer client first
      if (manualPassword.trim()) {
        // If password is provided, use it
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} and password`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}&p=${manualPassword}`;
      } else {
        // For direct connection without password
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} (direct connection)`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;
      }

      // Fallback to web client after a short delay
      setTimeout(() => {
        // For web client, use the appropriate URL format
        const webUrl = manualPassword.trim()
          ? `https://start.teamviewer.com/${formattedDeviceId}?password=${manualPassword}`
          : `https://start.teamviewer.com/${formattedDeviceId}`;

        console.log(`Opening web client fallback: ${webUrl}`);
        window.open(webUrl, '_blank');
      }, 1500);

      // Notify parent component if callback provided
      if (onDeviceConnect) {
        onDeviceConnect(manualDeviceId, "Manual Device");
      }
    } catch (err) {
      console.error("Error connecting to manual device:", err);
      setError("Failed to connect to device. Please check the ID and password.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Unattended Access</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Devices List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Your Unattended Devices</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDevices}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {devices.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No unattended devices found. Add devices to your TeamViewer account for unattended access.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleConnectToDevice(device)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">ID: {device.deviceId}</p>
                      </div>
                      <Button
                        size="sm"
                        disabled={isConnecting && selectedDevice?.id === device.id}
                      >
                        {isConnecting && selectedDevice?.id === device.id ? "Connecting..." : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Connection */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Manual Unattended Connection</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  placeholder="Enter TeamViewer ID"
                  value={manualDeviceId}
                  onChange={(e) => setManualDeviceId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-password"
                      checked={showPassword}
                      onCheckedChange={setShowPassword}
                    />
                    <Label htmlFor="show-password" className="text-xs">Show</Label>
                  </div>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter device password"
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleManualConnect}
                disabled={isConnecting || !manualDeviceId.trim()}
                className="w-full"
              >
                {isConnecting ? "Connecting..." : "Connect to Device"}
              </Button>
              <p className="text-xs text-slate-500 mt-1">
                Note: Password is optional. If not provided, you'll need to accept the connection on the device.
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">About Unattended Access</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Unattended access allows you to connect to devices without someone physically accepting the connection.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              To set up unattended access:
            </p>
            <ol className="list-decimal list-inside text-sm text-slate-500 dark:text-slate-400 ml-2 mt-1 space-y-1">
              <li>Install TeamViewer on the device</li>
              <li>Assign the device to your TeamViewer account</li>
              <li>Set up a permanent password for the device</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
