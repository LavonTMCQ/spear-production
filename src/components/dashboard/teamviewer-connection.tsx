"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowPathIcon, ArrowsPointingOutIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

interface TeamViewerConnectionProps {
  deviceId: string;
  deviceName: string;
}

export function TeamViewerConnection({ deviceId, deviceName }: TeamViewerConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

  // Update elapsed time every second when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConnected && connectionTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - connectionTime.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, connectionTime]);

  const handleConnect = () => {
    setIsConnecting(true);

    // In a real implementation, we would make an API call to create a session
    // For now, we'll just simulate the connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionTime(new Date());

      // Log connection details for debugging
      console.log(`Connecting to TeamViewer device: ${deviceId}`);
      console.log(`TeamViewer URL: https://start.teamviewer.com/${deviceId}`);

      // Show a success message
      alert('TeamViewer connection initiated! If TeamViewer is installed on your device, it should open automatically. Otherwise, click "Connect with TeamViewer Client" to try again or use the web client option.');
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionTime(null);
    setElapsedTime("00:00:00");
    setIsDisconnectDialogOpen(false);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <Card className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center">
                <ComputerDesktopIcon className="h-5 w-5 mr-2" />
                {deviceName}
              </CardTitle>
              <CardDescription>
                Device ID: {deviceId}
              </CardDescription>
            </div>
            {isConnected && (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFullscreen}
                  className="h-8 w-8 p-0 flex items-center justify-center"
                >
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  className="h-8 w-8 p-0 flex items-center justify-center text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
          {isConnected && (
            <div className="flex items-center mt-1">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
              <span className="mx-2 text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{elapsedTime}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          {isConnected ? (
            <div className={`bg-slate-900 rounded-md overflow-hidden ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[400px]'}`}>
              {/* TeamViewer connection info and direct link */}
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
                <div className="bg-slate-800 p-8 rounded-lg max-w-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 mx-auto mb-4 text-blue-400">
                    <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-medium mb-3">Connect to {deviceName}</h3>
                  <p className="text-slate-300 mb-6">
                    Due to security restrictions, TeamViewer cannot be embedded directly in this page.
                    Click the button below to open TeamViewer in a new tab and connect to your device.
                  </p>

                  <div className="bg-slate-700 p-3 rounded-md text-sm text-slate-300 font-mono text-left mb-6">
                    <p>Device ID: {deviceId}</p>
                    <p>Status: Ready to connect</p>
                    <p>Session Time: {elapsedTime}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        // Format the device ID by removing spaces if present
                        const formattedDeviceId = deviceId.replace(/\s+/g, '');

                        // Show guidance message
                        alert(`Connecting to device ${deviceId}. If TeamViewer is installed, it should open automatically. Make sure TeamViewer is also running on your device.`);

                        // Try to launch TeamViewer client first with the s= parameter
                        window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;

                        // Fallback to web client after a short delay
                        setTimeout(() => {
                          // For web client, we use the direct URL format
                          window.open(`https://start.teamviewer.com/${formattedDeviceId}`, '_blank');
                        }, 1500);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                      Connect with TeamViewer Client
                    </button>

                    <button
                      onClick={() => {
                        // Format the device ID by removing spaces if present
                        const formattedDeviceId = deviceId.replace(/\s+/g, '');
                        window.open(`https://start.teamviewer.com/${formattedDeviceId}`, '_blank');
                      }}
                      className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                      Open TeamViewer Web Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-6 flex flex-col items-center justify-center h-[400px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-slate-400 mb-4">
                <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Remote Control</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
                Connect to {deviceName} to start a remote control session. You'll be able to view and control the device remotely.
              </p>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-40"
              >
                {isConnecting ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Now"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={isDisconnectDialogOpen} onOpenChange={setIsDisconnectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect from {deviceName}? This will end your current remote control session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDisconnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
