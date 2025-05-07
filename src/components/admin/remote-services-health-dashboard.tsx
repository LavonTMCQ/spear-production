"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "unknown";
  lastChecked: string;
  responseTime?: number;
  message?: string;
}

export function RemoteServicesHealthDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [teamViewerStatus, setTeamViewerStatus] = useState<ServiceStatus[]>([
    {
      name: "Authentication API",
      status: "unknown",
      lastChecked: "-"
    },
    {
      name: "Session Management",
      status: "unknown",
      lastChecked: "-"
    },
    {
      name: "Device Management",
      status: "unknown",
      lastChecked: "-"
    }
  ]);



  const refreshStatus = () => {
    setIsRefreshing(true);

    // Simulate API calls to check service status
    setTimeout(() => {
      // Update TeamViewer status
      const updatedTeamViewerStatus = teamViewerStatus.map(service => {
        const statuses: ("operational" | "degraded" | "outage")[] = ["operational", "operational", "operational", "degraded"];
        return {
          ...service,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          responseTime: Math.floor(Math.random() * 300) + 50,
          lastChecked: new Date().toLocaleString()
        };
      });

      setTeamViewerStatus(updatedTeamViewerStatus);
      setIsRefreshing(false);
    }, 1500);
  };

  // Initial status check on component mount
  useEffect(() => {
    refreshStatus();
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
        return <ExclamationCircleIcon className="h-5 w-5 text-slate-400" />;
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

  const getOverallStatus = (services: ServiceStatus[]) => {
    if (services.some(s => s.status === "outage")) return "outage";
    if (services.some(s => s.status === "degraded")) return "degraded";
    if (services.every(s => s.status === "operational")) return "operational";
    return "unknown";
  };

  const teamViewerOverallStatus = getOverallStatus(teamViewerStatus);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Remote Services Health</CardTitle>
          <CardDescription>
            Monitor the status of all remote access services
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshStatus}
          disabled={isRefreshing}
          className="flex items-center"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teamviewer">TeamViewer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src="/images/teamviewer-logo.png"
                    alt="TeamViewer"
                    className="h-6 w-6 mr-2"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <h3 className="font-medium">TeamViewer</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(teamViewerOverallStatus)}`}>
                  {teamViewerOverallStatus.charAt(0).toUpperCase() + teamViewerOverallStatus.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                {teamViewerStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{service.name}</span>
                    <div className="flex items-center">
                      {getStatusIcon(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teamviewer">
            <div className="space-y-4">
              {teamViewerStatus.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center">
                    {getStatusIcon(service.status)}
                    <div className="ml-3">
                      <div className="font-medium">{service.name}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      {service.responseTime ? `${service.responseTime}ms` : "—"} | Last checked: {service.lastChecked}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
