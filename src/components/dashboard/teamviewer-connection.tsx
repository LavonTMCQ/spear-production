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
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionTime(new Date());
    }, 2000);
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
              {/* This would be the TeamViewer iframe in a real implementation */}
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <div className="text-center p-6 max-w-md">
                  <ComputerDesktopIcon className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-medium mb-2">Remote Session Active</h3>
                  <p className="text-slate-400 mb-4">
                    You are now connected to {deviceName}. This is where the remote control interface would be embedded.
                  </p>
                  <div className="bg-slate-800 p-3 rounded-md text-xs text-slate-300 font-mono text-left">
                    <p>Connection ID: {deviceId}</p>
                    <p>Status: Connected</p>
                    <p>Session Time: {elapsedTime}</p>
                    <p>Resolution: 1920x1080</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-6 flex flex-col items-center justify-center h-[400px]">
              <ComputerDesktopIcon className="h-16 w-16 text-slate-400 mb-4" />
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
