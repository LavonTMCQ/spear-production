"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SessionRecording } from "@/components/dashboard/session-recording";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";

// Mock session data
const mockSessions = [
  {
    id: "session1",
    deviceId: "device1",
    deviceName: "Office Laptop",
    service: "teamviewer",
    date: "2023-06-15",
    time: "14:30",
    duration: "00:45:12",
    user: "John Smith",
    recorded: true
  },
  {
    id: "session2",
    deviceId: "device2",
    deviceName: "Reception Tablet",
    service: "teamviewer",
    date: "2023-06-14",
    time: "10:15",
    duration: "00:22:45",
    user: "Jane Doe",
    recorded: true
  },
  {
    id: "session3",
    deviceId: "device3",
    deviceName: "Warehouse Scanner",
    service: "teamviewer",
    date: "2023-06-12",
    time: "16:20",
    duration: "00:18:33",
    user: "John Smith",
    recorded: false
  },
  {
    id: "session4",
    deviceId: "device4",
    deviceName: "CEO iPhone",
    service: "teamviewer",
    date: "2023-06-10",
    time: "09:45",
    duration: "00:12:18",
    user: "Jane Doe",
    recorded: true
  },
  {
    id: "session5",
    deviceId: "device5",
    deviceName: "Meeting Room Display",
    service: "teamviewer",
    date: "2023-06-08",
    time: "11:30",
    duration: "00:35:22",
    user: "John Smith",
    recorded: true
  }
];

export default function RecordingsPage() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");

  const handleViewRecording = (session: any) => {
    setSelectedSession(session);
    setIsRecordingDialogOpen(true);
  };

  const getServiceIcon = (service: string) => {
    if (service === "teamviewer") {
      return (
        <img
          src="/images/teamviewer-logo.png"
          alt="TeamViewer"
          className="h-5 w-5"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    return null;
  };

  const filteredSessions = mockSessions.filter(session => {
    // Apply service filter
    if (serviceFilter !== "all" && session.service !== serviceFilter) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        session.deviceName.toLowerCase().includes(query) ||
        session.user.toLowerCase().includes(query) ||
        session.date.includes(query)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Session Recordings</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage recordings of remote access sessions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by device, user, or date"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-slate-400" />
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="teamviewer">TeamViewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Sessions</CardTitle>
          <CardDescription>
            View and play recordings of recent remote access sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Recording</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.deviceName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getServiceIcon(session.service)}
                        <span className="ml-2">
                          TeamViewer
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-slate-400" />
                        {session.date} {session.time}
                      </div>
                    </TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.user}</TableCell>
                    <TableCell>
                      {session.recorded ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                          Not recorded
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecording(session)}
                        disabled={!session.recorded}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                      No sessions found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRecordingDialogOpen} onOpenChange={setIsRecordingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Session Recording</DialogTitle>
            <DialogDescription>
              {selectedSession?.date} {selectedSession?.time} - {selectedSession?.deviceName}
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <SessionRecording
              deviceId={selectedSession.deviceId}
              deviceName={selectedSession.deviceName}
              service="teamviewer"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
