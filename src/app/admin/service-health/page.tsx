"use client";

import { RemoteServicesHealthDashboard } from "@/components/admin/remote-services-health-dashboard";

export default function ServiceHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remote Services Health</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor the status and health of all remote access services</p>
      </div>

      <RemoteServicesHealthDashboard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Service Uptime</h2>
          <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-md">
            <p className="text-slate-500 dark:text-slate-400">Uptime chart would be displayed here</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <div className="space-y-4">
            <div className="p-3 border rounded-md">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                <span className="font-medium">TeamViewer API Degraded Performance</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                2023-06-15 14:32 - Resolved after 45 minutes
              </p>
            </div>

            <div className="p-3 border rounded-md">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                <span className="font-medium">TeamViewer Authentication Service Outage</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                2023-06-10 09:15 - Resolved after 2 hours
              </p>
            </div>

            <div className="p-3 border rounded-md">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                <span className="font-medium">TeamViewer Session Management Degraded</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                2023-06-05 16:45 - Resolved after 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
