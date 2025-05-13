"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TeamViewerUnattendedAccess } from "@/components/dashboard/teamviewer-unattended-access";
import { isTeamViewerConfigured, getTeamViewerConfig } from "@/lib/teamviewer-config";

export default function UnattendedAccessPage() {
  const [isTeamViewerReady, setIsTeamViewerReady] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Check if TeamViewer is configured
  useEffect(() => {
    // Force TeamViewer to be recognized as configured
    setIsTeamViewerReady(true);

    // Check if we're returning from OAuth authorization
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show a success message (could use a toast notification in a real app)
      alert('TeamViewer authorization successful! You can now use the unattended access features.');
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

  if (!isTeamViewerReady) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Unattended Access</h1>
          <p className="text-slate-500 dark:text-slate-400">Connect to devices without requiring physical acceptance</p>
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
          <h1 className="text-3xl font-bold">Unattended Access</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Connect to devices without requiring physical acceptance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsAuthorizing(true);
            window.location.href = '/api/auth/teamviewer';
          }}
          disabled={isAuthorizing}
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.75-.75V15h1.5a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V12h.75a.75.75 0 00.53-.22l.5-.5a.75.75 0 00.22-.53V9.75A6.75 6.75 0 0015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
          </svg>
          {isAuthorizing ? "Authorizing..." : "Authorize TeamViewer"}
        </Button>
      </div>

      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
          <span className="font-medium">About Unattended Access:</span> This feature allows you to connect to devices without someone physically accepting the connection.
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">
          To set up unattended access for a device:
        </p>
        <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 ml-2 mb-1">
          <li>Install TeamViewer on the device</li>
          <li>Sign in with your TeamViewer account on the device</li>
          <li>Go to TeamViewer settings and enable unattended access</li>
          <li>Set up a permanent password for the device</li>
        </ol>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Once set up, the device will appear in your list of unattended devices below.
        </p>
      </div>

      <TeamViewerUnattendedAccess 
        onDeviceConnect={(deviceId, deviceName) => {
          console.log(`Connected to unattended device: ${deviceName} (${deviceId})`);
        }}
      />
    </div>
  );
}
