"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUnattendedDevices,
  TeamViewerUnattendedDevice,
  connectToUnattendedDevice,
  UnattendedConnectionResult
} from "@/lib/teamviewer-unattended";
import {
  formatTeamViewerDeviceId,
  endTeamViewerSession,
  getTeamViewerToken,
  TeamViewerSession
} from "@/lib/teamviewer-api";

interface TeamViewerUnattendedAccessProps {
  onDeviceConnect?: (deviceId: string, deviceName: string) => void;
}

// Interface for tracking active sessions
interface ActiveSession {
  id: string;
  deviceId: string;
  deviceName: string;
  startTime: string;
  expiresAt: string;
  connectionUrl: string;
  webClientUrl?: string;
  endCustomerUrl?: string;
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
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isClosingSession, setIsClosingSession] = useState<string | null>(null);

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

    // Clean up expired sessions every minute
    const cleanupInterval = setInterval(() => {
      cleanupExpiredSessions();
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Function to track a new session
  const trackSession = (result: UnattendedConnectionResult, device: TeamViewerUnattendedDevice | { id: string, name: string }) => {
    if (!result.sessionId) return;

    const newSession: ActiveSession = {
      id: result.sessionId,
      deviceId: result.deviceId,
      deviceName: device.name || `Device ${device.id}`,
      startTime: new Date().toISOString(),
      expiresAt: result.expiresAt,
      connectionUrl: result.connectionUrl,
      webClientUrl: result.webClientUrl,
      endCustomerUrl: result.endCustomerUrl
    };

    setActiveSessions(prev => [...prev, newSession]);
    console.log(`Session tracked: ${result.sessionId} for device ${device.name || device.id}`);
  };

  // Function to clean up expired sessions
  const cleanupExpiredSessions = () => {
    const now = new Date().toISOString();
    setActiveSessions(prev => prev.filter(session => session.expiresAt > now));
  };

  // Function to close a session
  const handleCloseSession = async (sessionId: string) => {
    setIsClosingSession(sessionId);
    setError(null);

    try {
      await endTeamViewerSession(sessionId);
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      console.log(`Session closed: ${sessionId}`);
    } catch (err) {
      console.error("Error closing session:", err);
      setError("Failed to close session. It may have already expired.");
    } finally {
      setIsClosingSession(null);
    }
  };

  // Connect to a device
  const handleConnectToDevice = async (device: TeamViewerUnattendedDevice) => {
    setSelectedDevice(device);
    setIsConnecting(true);
    setError(null);

    try {
      console.log(`Connecting to device: ${device.name} (ID: ${device.id}, Remote ID: ${device.deviceId})`);
      const result = await connectToUnattendedDevice(device.id);

      // Ensure we have a valid deviceId from the result
      if (!result.deviceId) {
        console.error('No deviceId returned in connection result, using device.deviceId instead');
        result.deviceId = device.deviceId;
      }

      // Format the device ID using our utility function
      const formattedDeviceId = formatTeamViewerDeviceId(result.deviceId);

      console.log(`Connection result device ID: ${result.deviceId}, formatted: ${formattedDeviceId}`);

      // Track the session
      if (result.sessionId) {
        trackSession(result, device);
      }

      // Show guidance message
      if (device.supportsUnattended) {
        alert(`Connecting to unattended device ${device.name} (ID: ${formattedDeviceId}) in Host mode. TeamViewer should open automatically and connect without requiring acceptance on the device.`);
      } else {
        alert(`Connecting to device ${device.name} (ID: ${formattedDeviceId}). TeamViewer should open automatically. You will need to accept the connection on the device.`);
      }

      // Use the connection URL provided by the connectToUnattendedDevice function
      // This will use the correct URL format for either Host mode or Quick Support mode
      if (result.connectionUrl) {
        console.log(`Launching TeamViewer with connection URL: ${result.connectionUrl}`);
        window.location.href = result.connectionUrl;
      }
      // Fallback for session-based connections (Quick Support mode)
      else if (result.password) {
        // If we have a password, use it
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} and password`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}&p=${result.password}`;
      } else {
        // For direct connection without password (basic fallback)
        console.log(`Launching TeamViewer with ID: ${formattedDeviceId} (direct connection)`);
        window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;
      }

      // Fallback to web client after a short delay
      setTimeout(() => {
        // Use the web client URL if available
        if (result.webClientUrl) {
          console.log(`Opening web client fallback: ${result.webClientUrl}`);
          window.open(result.webClientUrl, '_blank');
        }
        // If no web client URL is available, try to construct one
        else if (device.supportsUnattended) {
          // For unattended access (Host mode), use the proper web client URL format
          const deviceName = device.name || 'Android Device';
          const webUrl = `https://web.teamviewer.com/Connect?uiMode=OneUI&lng=en&TabMode=MultiTabUI&machineId=${formattedDeviceId}&deviceName=${encodeURIComponent(deviceName)}&deviceType=Mobile&connectByKnownDeviceMode=RemoteControl`;
          console.log(`Opening constructed web client fallback for unattended access: ${webUrl}`);
          window.open(webUrl, '_blank');
        }
        // For session-based connections (Quick Support mode)
        else {
          const webUrl = `https://start.teamviewer.com/${formattedDeviceId}`;
          console.log(`Opening basic web client fallback: ${webUrl}`);
          window.open(webUrl, '_blank');
        }
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
  const handleManualConnect = async () => {
    if (!manualDeviceId.trim()) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Format the device ID using our utility function
      const formattedDeviceId = formatTeamViewerDeviceId(manualDeviceId);

      // Show guidance message
      if (manualPassword.trim()) {
        alert(`Connecting to device with ID: ${formattedDeviceId} using provided password. TeamViewer should open automatically.`);
      } else {
        alert(`Connecting to device with ID: ${formattedDeviceId}. You will need to accept the connection on the device. TeamViewer should open automatically.`);
      }

      // Try to create a session first if possible
      try {
        // Use the main sessions API to create a session
        const token = await getTeamViewerToken();
        const response = await fetch('https://webapi.teamviewer.com/api/v1/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            groupname: 'Spear Manual Connection',
            description: 'Manual connection from Spear',
            end_customer: {
              name: 'Spear User',
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('TeamViewer session created for manual connection:', data);

          // Track the session
          const result: UnattendedConnectionResult = {
            deviceId: formattedDeviceId,
            password: data.password || '',
            connectionUrl: data.supporter_link || `https://start.teamviewer.com/${formattedDeviceId}`,
            webClientUrl: data.webclient_supporter_link,
            endCustomerUrl: data.end_customer_link,
            sessionId: data.code,
            expiresAt: data.valid_until || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          };

          trackSession(result, { id: manualDeviceId, name: "Manual Device" });

          // Launch TeamViewer with the session URL
          if (data.supporter_link) {
            console.log(`Launching TeamViewer with session URL: ${data.supporter_link}`);
            window.location.href = data.supporter_link;
          } else {
            // Fall back to direct connection
            if (manualPassword.trim()) {
              console.log(`Launching TeamViewer with ID: ${formattedDeviceId} and password`);
              window.location.href = `teamviewer10://control?s=${formattedDeviceId}&p=${manualPassword}`;
            } else {
              console.log(`Launching TeamViewer with ID: ${formattedDeviceId} (direct connection)`);
              window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;
            }
          }

          // Fallback to web client after a short delay
          setTimeout(() => {
            const webUrl = data.webclient_supporter_link ||
              (manualPassword.trim()
                ? `https://start.teamviewer.com/${formattedDeviceId}?password=${manualPassword}`
                : `https://start.teamviewer.com/${formattedDeviceId}`);

            console.log(`Opening web client fallback: ${webUrl}`);
            window.open(webUrl, '_blank');
          }, 1500);

          // Notify parent component if callback provided
          if (onDeviceConnect) {
            onDeviceConnect(manualDeviceId, "Manual Device");
          }

          return;
        }
      } catch (sessionError) {
        console.error("Error creating session for manual connection:", sessionError);
        // Fall through to direct connection
      }

      // Fall back to direct connection if session creation fails
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
        <CardTitle className="text-xl">TeamViewer Remote Access</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="devices">
          <TabsList className="mb-4">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="sessions" className="relative">
              Sessions
              {activeSessions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeSessions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            {/* Devices List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Your Devices</h3>
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
                    No devices found. Add devices to your TeamViewer account for remote access.
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
                          <p className="text-xs text-slate-500">
                            {device.online ? (
                              <span className="text-green-500">● Online</span>
                            ) : (
                              <span className="text-gray-500">● Offline</span>
                            )}
                            {device.supportsUnattended && (
                              <span className="ml-2 text-blue-500">Unattended Access</span>
                            )}
                          </p>
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
              <h3 className="text-sm font-medium mb-2">Manual Connection</h3>
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
                    <Label htmlFor="password">Password (Optional)</Label>
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
              <h3 className="text-sm font-medium mb-2">About Remote Access</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                TeamViewer allows you to connect to devices remotely. Unattended access lets you connect without someone physically accepting the connection.
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
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Active Sessions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cleanupExpiredSessions}
                >
                  Refresh
                </Button>
              </div>

              {activeSessions.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No active sessions. Connect to a device to create a session.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{session.deviceName}</h4>
                          <p className="text-xs text-slate-500 font-mono">Session ID: {session.id}</p>
                          <p className="text-xs text-slate-500">
                            Expires: {new Date(session.expiresAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => window.open(session.connectionUrl, '_blank')}
                          >
                            Connect
                          </Button>
                          {session.webClientUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(session.webClientUrl, '_blank')}
                            >
                              Web
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCloseSession(session.id)}
                            disabled={isClosingSession === session.id}
                          >
                            {isClosingSession === session.id ? "Closing..." : "Close"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">About Sessions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sessions allow you to reconnect to devices without creating a new connection each time.
                  Sessions are valid for 24 hours by default.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  You can close a session when you're done to prevent unauthorized access.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
