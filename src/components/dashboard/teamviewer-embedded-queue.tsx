"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createServiceQueueSession, ServiceQueueSession } from "@/lib/teamviewer-service-queue";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamViewerEmbeddedQueueProps {
  queueId: string;
  deviceName: string;
  customFields?: Record<string, string>;
}

export function TeamViewerEmbeddedQueue({
  queueId,
  deviceName,
  customFields,
}: TeamViewerEmbeddedQueueProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ServiceQueueSession | null>(null);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createServiceQueueSession(queueId, customFields);
      setSession(result.session);
      setConnectionUrl(result.connectionUrl);
      setEmbeddedUrl(result.embeddedUrl);
      setIsEmbedded(true);
    } catch (err) {
      console.error("Error creating service queue session:", err);
      setError("Failed to create service queue session. Please try again.");
      setIsEmbedded(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle iframe load errors
  useEffect(() => {
    const handleIframeError = () => {
      setError("Failed to load TeamViewer in embedded mode. Please use the direct connection option.");
      setIsEmbedded(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('error', handleIframeError);
      return () => {
        iframe.removeEventListener('error', handleIframeError);
      };
    }
  }, [iframeRef.current]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <div>Remote Support for {deviceName} (Embedded)</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {session && isEmbedded ? (
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

            <div className="bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
              <div className="p-2 bg-slate-200 dark:bg-slate-700 flex justify-between items-center">
                <span className="text-sm font-medium">TeamViewer Remote Control</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!connectionUrl) return;
                    window.open(connectionUrl, "_blank");
                  }}
                  className="h-8 px-2 text-xs"
                >
                  Open in New Window
                </Button>
              </div>
              <div className="h-[500px] relative">
                {embeddedUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={embeddedUrl}
                    className="w-full h-full border-0"
                    allow="camera; microphone; clipboard-read; clipboard-write"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-slate-500">Loading TeamViewer...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (!connectionUrl) return;

                  // Try to launch TeamViewer client first
                  // Format the device ID by removing spaces if present
                  const formattedDeviceId = session?.code.replace(/\s+/g, '');
                  window.location.href = `teamviewer10://control?s=${formattedDeviceId}`;

                  // Fallback to web client after a short delay
                  setTimeout(() => {
                    window.open(connectionUrl, "_blank");
                  }, 1000);
                }}
                className="flex-1"
              >
                Open in TeamViewer Client
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSession(null);
                  setEmbeddedUrl(null);
                  setConnectionUrl(null);
                  setIsEmbedded(false);
                }}
              >
                End Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create a remote support session to connect to {deviceName} directly in this window.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                <span className="font-medium">Note:</span> This will attempt to embed TeamViewer directly in this page.
                If embedding fails, you can still use the TeamViewer client or web client options.
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
                  Creating Embedded Session...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  Create Embedded Support Session
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
