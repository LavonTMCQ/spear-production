"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamViewerConnection } from "@/components/dashboard/teamviewer-connection";
import { TeamViewerServiceQueue } from "@/components/dashboard/teamviewer-service-queue";
import { TeamViewerEmbeddedQueue } from "@/components/dashboard/teamviewer-embedded-queue";
import { TeamViewerUnattendedAccess } from "@/components/dashboard/teamviewer-unattended-access";
import { TeamViewerConnectionReports } from "@/components/admin/teamviewer-connection-reports";
import { isTeamViewerConfigured, getTeamViewerConfig } from "@/lib/teamviewer-config";
import { TeamViewerDevice } from "@/lib/teamviewer-api";
import { ArrowPathIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Interface for our device display model
interface DeviceDisplayModel {
  id: string;
  name: string;
  deviceModel: string;
  deviceId: string;
  status: string;
  lastActive: string | null;
}

export default function RemoteControlPage() {
  const [devices, setDevices] = useState<DeviceDisplayModel[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceDisplayModel | null>(null);
  const [isTeamViewerReady, setIsTeamViewerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [manualDeviceId, setManualDeviceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"direct" | "service-queue" | "embedded-queue" | "unattended">("direct");
  const [activeSection, setActiveSection] = useState<"connect" | "reports">("connect");

  // Check if TeamViewer is configured and fetch devices
  useEffect(() => {
    // Force TeamViewer to be recognized as configured
    setIsTeamViewerReady(true);

    // Fetch devices regardless of configuration status
    fetchDevices();

    // Check if we're returning from OAuth authorization
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');

    if (authStatus === 'success') {
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);

      // Show a success message (could use a toast notification in a real app)
      alert('TeamViewer authorization successful! You can now use the remote control features.');
    }

    // Log configuration status for debugging
    const config = getTeamViewerConfig();
    console.log("TeamViewer configured:", isTeamViewerConfigured());
    console.log("TeamViewer config:", {
      clientId: config.clientId ? config.clientId.substring(0, 8) + '...' : 'not set',
      clientSecretSet: Boolean(config.clientSecret),
      redirectUri: config.redirectUri,
    });
  }, []);

  // Function to fetch devices from the API
  const fetchDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teamviewer/devices');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch devices');
      }

      // Map TeamViewer devices to our display model
      const mappedDevices: DeviceDisplayModel[] = data.devices.map((device: TeamViewerDevice) => ({
        id: device.id,
        name: device.name || 'Unnamed Device',
        deviceModel: device.device_info?.model || 'Unknown Model',
        deviceId: device.id,
        status: device.online_state,
        lastActive: device.last_seen || null,
      }));

      setDevices(mappedDevices);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Use empty array if we can't fetch real devices
      setDevices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDevice = (device: DeviceDisplayModel) => {
    setSelectedDevice(device);
  };

  const handleManualConnect = () => {
    if (!manualDeviceId.trim()) return;

    // Create a temporary device object
    const tempDevice: DeviceDisplayModel = {
      id: manualDeviceId.trim(),
      name: "Manual Connection",
      deviceModel: "Unknown",
      deviceId: manualDeviceId.trim(),
      status: "unknown",
      lastActive: null,
    };

    setSelectedDevice(tempDevice);
  };

  const handleRefreshDevices = () => {
    fetchDevices();
  };

  if (!isTeamViewerReady) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Remote Control</h1>
          <p className="text-slate-500 dark:text-slate-400">Connect to and control remote devices</p>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-slate-400">
              <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold">TeamViewer Not Configured</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              TeamViewer API credentials are not configured. Please set up the TeamViewer integration to use this feature.
            </p>
            <Button
              onClick={() => window.location.href = '/admin/integrations'}
              className="mt-4"
            >
              Configure TeamViewer
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Remote Control</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Connect to and control remote devices using TeamViewer integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeSection === "connect" ? "default" : "outline"}
            onClick={() => setActiveSection("connect")}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
            Connect
          </Button>
          <Button
            variant={activeSection === "reports" ? "default" : "outline"}
            onClick={() => setActiveSection("reports")}
            className="flex items-center"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <div className="flex space-x-2 ml-2">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/auth/teamviewer'}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V9.75A6.75 6.75 0 0015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
              </svg>
              Authorize
            </Button>
            <Button
              variant="outline"
              onClick={handleRefreshDevices}
              disabled={isLoading}
              className="flex items-center"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {activeSection === "connect" && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            <span className="font-medium">Note:</span> For the best experience, install the TeamViewer client on your computer. The "Connect with TeamViewer Client" button will launch the client if installed.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            If you don't have the TeamViewer client installed, you can use the web client, but it will open in a new tab.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            You can use Direct Connection, Service Queue, Embedded Queue, or Unattended Access to connect to devices. Each method offers different features for remote control sessions.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            <span className="font-medium">Important:</span> To connect to your device, make sure TeamViewer is installed and running on your device. The device ID shown (579 487 224) is your device's TeamViewer ID.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            <span className="font-medium">Unattended Access:</span> For devices you want to access without someone physically accepting the connection, use the Unattended Access tab. This requires setting up the device in your TeamViewer account first.
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-blue-700 dark:text-blue-400 underline"
              onClick={() => window.location.href = '/admin/unattended-access'}
            >
              Go to Unattended Access page
            </Button>
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            If you're having trouble connecting, try clicking "Authorize" first to authenticate with TeamViewer, then try connecting again.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Available Devices</CardTitle>
              <CardDescription>
                Select a device to start a remote control session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <ArrowPathIcon className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">Loading devices...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-red-500 mb-2">Error loading devices</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleRefreshDevices}
                  >
                    Try Again
                  </Button>
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">No devices available</p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDevice?.id === device.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                    onClick={() => handleSelectDevice(device)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-slate-500">{device.deviceModel}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          device.status === "online"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {device.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="font-mono">ID: {device.deviceId}</span>
                      {device.lastActive && (
                        <div className="mt-1">
                          Last active: {new Date(device.lastActive).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Manual Connection</CardTitle>
              <CardDescription>
                Connect to a device using its TeamViewer ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">TeamViewer ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="deviceId"
                    placeholder="Enter TeamViewer ID"
                    value={manualDeviceId}
                    onChange={(e) => setManualDeviceId(e.target.value)}
                  />
                  <Button onClick={handleManualConnect} disabled={!manualDeviceId.trim()}>
                    Connect
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <h3 className="text-sm font-medium mb-2">Quick Connect to Your Device</h3>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                    <span className="font-medium">Recommended:</span> For the best experience, use the direct link below to open TeamViewer in a new tab.
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Your device ID: <span className="font-mono font-medium">579 487 224</span>
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => {
                      // Format the device ID properly - remove spaces
                      const formattedDeviceId = '579487224';

                      // Show guidance message
                      alert(`Connecting to your device (ID: 579 487 224). Make sure TeamViewer is installed and running on both your computer and your device. If you're having trouble connecting, try clicking the "Authorize" button first.`);

                      // Try to launch TeamViewer client first with the s= parameter
                      window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;

                      // Fallback to web client after a short delay
                      setTimeout(() => {
                        window.open(`https://start.teamviewer.com/${formattedDeviceId}`, '_blank');
                      }, 1500);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                    Connect with TeamViewer Client
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="justify-center"
                      onClick={() => window.open('https://start.teamviewer.com/579487224', '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                        <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
                      </svg>
                      Web Client
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-center"
                      onClick={() => {
                        // Create a device object with your real TeamViewer ID
                        const realDevice: DeviceDisplayModel = {
                          id: '579487224', // Your actual TeamViewer ID
                          name: 'Your Real Phone',
                          deviceModel: 'Your Device',
                          deviceId: '579487224', // Your actual TeamViewer ID without spaces
                          status: 'online',
                          lastActive: new Date().toISOString(),
                        };

                        // Set active tab to direct connection for best experience
                        setActiveTab("direct");
                        setSelectedDevice(realDevice);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                      </svg>
                      Show Info
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {activeSection === "connect" ? (
            selectedDevice ? (
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800">
                  <div className="flex space-x-4">
                    <button
                      className={`py-2 px-1 font-medium text-sm border-b-2 ${
                        activeTab === "direct"
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("direct")}
                    >
                      Direct Connection
                    </button>
                    <button
                      className={`py-2 px-1 font-medium text-sm border-b-2 ${
                        activeTab === "service-queue"
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("service-queue")}
                    >
                      Service Queue
                    </button>
                    <button
                      className={`py-2 px-1 font-medium text-sm border-b-2 ${
                        activeTab === "embedded-queue"
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("embedded-queue")}
                    >
                      Embedded Queue
                    </button>
                    <button
                      className={`py-2 px-1 font-medium text-sm border-b-2 ${
                        activeTab === "unattended"
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      onClick={() => setActiveTab("unattended")}
                    >
                      Unattended Access
                    </button>
                  </div>
                </div>

                {activeTab === "direct" && (
                  <TeamViewerConnection
                    deviceId={selectedDevice.deviceId}
                    deviceName={selectedDevice.name}
                  />
                )}

                {activeTab === "service-queue" && (
                  <TeamViewerServiceQueue
                    queueId="q12345" // This would be a real queue ID in production
                    deviceName={selectedDevice.name}
                    customFields={{
                      deviceId: selectedDevice.deviceId,
                      deviceModel: selectedDevice.deviceModel,
                      requestedBy: "Admin User",
                      requestTime: new Date().toISOString(),
                    }}
                  />
                )}

                {activeTab === "embedded-queue" && (
                  <TeamViewerEmbeddedQueue
                    queueId="q12345" // This would be a real queue ID in production
                    deviceName={selectedDevice.name}
                    customFields={{
                      deviceId: selectedDevice.deviceId,
                      deviceModel: selectedDevice.deviceModel,
                      requestedBy: "Admin User",
                      requestTime: new Date().toISOString(),
                    }}
                  />
                )}

                {activeTab === "unattended" && (
                  <TeamViewerUnattendedAccess
                    onDeviceConnect={(deviceId, deviceName) => {
                      console.log(`Connected to unattended device: ${deviceName} (${deviceId})`);
                    }}
                  />
                )}
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-slate-400 mx-auto mb-4">
                    <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-medium mb-2">No Device Selected</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Select a device from the list or enter a TeamViewer ID to start a remote control session.
                  </p>
                </div>
              </Card>
            )
          ) : (
            <TeamViewerConnectionReports />
          )}
        </div>
      </div>
    </div>
  );
}
