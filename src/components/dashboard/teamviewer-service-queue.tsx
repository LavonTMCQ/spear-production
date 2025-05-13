"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createServiceQueueSession, ServiceQueueSession } from "@/lib/teamviewer-service-queue";

interface TeamViewerServiceQueueProps {
  queueId: string;
  deviceName: string;
  customFields?: Record<string, string>;
}

export function TeamViewerServiceQueue({
  queueId,
  deviceName,
  customFields,
}: TeamViewerServiceQueueProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ServiceQueueSession | null>(null);
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createServiceQueueSession(queueId, customFields);
      setSession(result.session);
      setConnectionUrl(result.connectionUrl);
    } catch (err) {
      console.error("Error creating service queue session:", err);
      setError("Failed to create service queue session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <div>Remote Support for {deviceName}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {session ? (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
              <h3 className="font-medium mb-2">Session Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500 dark:text-slate-400">Session ID:</div>
                <div className="font-mono">{session.id}</div>
                <div className="text-slate-500 dark:text-slate-400">Code:</div>
                <div className="font-mono">{session.code}</div>
                <div className="text-slate-500 dark:text-slate-400">Status:</div>
                <div>{session.state}</div>
                <div className="text-slate-500 dark:text-slate-400">Created:</div>
                <div>{new Date(session.created).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click the button below to connect to the device using TeamViewer.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    if (!connectionUrl || !session?.code) return;

                    // Format the device ID by removing spaces if present
                    const formattedDeviceId = session.code.replace(/\s+/g, '');

                    // Try to launch TeamViewer client first with the s= parameter
                    window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;

                    // Fallback to web client after a short delay
                    setTimeout(() => {
                      window.open(connectionUrl, "_blank");
                    }, 1000);
                  }}
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  Connect with TeamViewer Client
                </Button>

                <Button
                  onClick={() => connectionUrl && window.open(connectionUrl, "_blank")}
                  variant="outline"
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
                  </svg>
                  Open TeamViewer Web Client
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create a remote support session to connect to {deviceName}.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                <span className="font-medium">Note:</span> Due to TeamViewer security restrictions, the remote control session will open in a new tab.
              </p>
            </div>
            <Button
              onClick={createSession}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Session...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  Create Support Session
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
