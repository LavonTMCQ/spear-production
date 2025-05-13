"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getConnectionReports, ConnectionReport } from "@/lib/teamviewer-reports";
import { ArrowPathIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export function TeamViewerConnectionReports() {
  const [reports, setReports] = useState<ConnectionReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ConnectionReport | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getConnectionReports({
        limit: 10,
        // Get reports from the last 30 days
        from_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setReports(result.records);
    } catch (err) {
      console.error("Error fetching connection reports:", err);
      setError("Failed to fetch connection reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewReport = (report: ConnectionReport) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Connection Reports</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            disabled={isLoading}
            className="h-8 px-2 text-xs"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {reports.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No connection reports available</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Connection reports will appear here after remote control sessions
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Device/User</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <ArrowPathIcon className="h-6 w-6 mx-auto text-slate-400 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono text-xs">
                          {report.session_code}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {report.connection_type === 'attended' ? 'Direct' : 'Service Queue'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(report.start_time).toLocaleString()}
                        </TableCell>
                        <TableCell>{formatDuration(report.duration)}</TableCell>
                        <TableCell>
                          {report.device_name || report.end_customer_name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                            className="h-8 px-2 text-xs"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connection Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the remote control session
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500 dark:text-slate-400">Session ID:</div>
                <div className="font-mono">{selectedReport.session_id}</div>
                <div className="text-slate-500 dark:text-slate-400">Session Code:</div>
                <div className="font-mono">{selectedReport.session_code}</div>
                <div className="text-slate-500 dark:text-slate-400">Connection Type:</div>
                <div>{selectedReport.connection_type}</div>
                <div className="text-slate-500 dark:text-slate-400">Supporter:</div>
                <div>{selectedReport.supporter_name}</div>
                {selectedReport.device_name && (
                  <>
                    <div className="text-slate-500 dark:text-slate-400">Device:</div>
                    <div>{selectedReport.device_name}</div>
                  </>
                )}
                {selectedReport.end_customer_name && (
                  <>
                    <div className="text-slate-500 dark:text-slate-400">End Customer:</div>
                    <div>{selectedReport.end_customer_name}</div>
                  </>
                )}
                <div className="text-slate-500 dark:text-slate-400">Start Time:</div>
                <div>{new Date(selectedReport.start_time).toLocaleString()}</div>
                <div className="text-slate-500 dark:text-slate-400">End Time:</div>
                <div>{new Date(selectedReport.end_time).toLocaleString()}</div>
                <div className="text-slate-500 dark:text-slate-400">Duration:</div>
                <div>{formatDuration(selectedReport.duration)}</div>
              </div>

              {selectedReport.custom_fields && Object.keys(selectedReport.custom_fields).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Custom Fields</h3>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(selectedReport.custom_fields).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <div className="text-slate-500 dark:text-slate-400">{key}:</div>
                          <div>{value}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
