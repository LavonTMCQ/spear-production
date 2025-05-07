"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface ApiEndpoint {
  name: string;
  endpoint: string;
  status: "operational" | "degraded" | "outage" | "unknown";
  responseTime: number | null;
  lastChecked: string;
}

export function TeamViewerApiStatus() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      name: "Authentication",
      endpoint: "/api/v1/oauth2/token",
      status: "unknown",
      responseTime: null,
      lastChecked: "-"
    },
    {
      name: "Session Management",
      endpoint: "/api/v1/sessions",
      status: "unknown",
      responseTime: null,
      lastChecked: "-"
    },
    {
      name: "User Management",
      endpoint: "/api/v1/users",
      status: "unknown",
      responseTime: null,
      lastChecked: "-"
    },
    {
      name: "Device Management",
      endpoint: "/api/v1/devices",
      status: "unknown",
      responseTime: null,
      lastChecked: "-"
    },
    {
      name: "Group Management",
      endpoint: "/api/v1/groups",
      status: "unknown",
      responseTime: null,
      lastChecked: "-"
    }
  ]);
  
  const [isChecking, setIsChecking] = useState(false);

  const checkApiStatus = () => {
    setIsChecking(true);
    
    // Simulate API status check
    const updatedEndpoints = [...endpoints];
    
    // Process each endpoint with a slight delay to simulate real checks
    const checkEndpoint = (index: number) => {
      if (index >= updatedEndpoints.length) {
        setIsChecking(false);
        setEndpoints(updatedEndpoints);
        return;
      }
      
      setTimeout(() => {
        // Generate random status and response time for demo
        const statuses: ("operational" | "degraded" | "outage")[] = ["operational", "operational", "operational", "degraded", "outage"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomResponseTime = randomStatus === "operational" 
          ? Math.floor(Math.random() * 200) + 50 
          : randomStatus === "degraded" 
            ? Math.floor(Math.random() * 500) + 300 
            : null;
        
        updatedEndpoints[index] = {
          ...updatedEndpoints[index],
          status: randomStatus,
          responseTime: randomResponseTime,
          lastChecked: new Date().toLocaleString()
        };
        
        setEndpoints([...updatedEndpoints]);
        checkEndpoint(index + 1);
      }, 500);
    };
    
    checkEndpoint(0);
  };
  
  // Initial check on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />;
      case "outage":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-slate-400" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded Performance";
      case "outage":
        return "Outage";
      default:
        return "Unknown";
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
      case "degraded":
        return "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20";
      case "outage":
        return "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/20";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">TeamViewer API Status</CardTitle>
          <CardDescription>
            Monitor the status of TeamViewer API endpoints
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkApiStatus}
          disabled={isChecking}
          className="flex items-center"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? "Checking..." : "Check Now"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-md border"
            >
              <div className="flex items-center">
                {getStatusIcon(endpoint.status)}
                <div className="ml-3">
                  <div className="font-medium">{endpoint.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{endpoint.endpoint}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(endpoint.status)}`}>
                  {getStatusText(endpoint.status)}
                </span>
                <div className="text-xs text-slate-500 mt-1">
                  {endpoint.responseTime ? `${endpoint.responseTime}ms` : "—"} | Last checked: {endpoint.lastChecked}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
