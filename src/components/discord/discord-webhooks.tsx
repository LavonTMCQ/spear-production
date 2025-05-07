"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Mock webhooks data
const mockWebhooks = [
  {
    id: "1",
    name: "System Announcements",
    url: "https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz",
    channel: "announcements",
    events: ["system.status", "system.maintenance"],
    active: true,
    lastTriggered: "2023-06-16T14:30:00Z",
    successRate: 98.5
  },
  {
    id: "2",
    name: "Support Tickets",
    url: "https://discord.com/api/webhooks/987654321/zyxwvutsrqponmlkjihgfedcba",
    channel: "support",
    events: ["ticket.created", "ticket.updated", "ticket.closed"],
    active: true,
    lastTriggered: "2023-06-16T10:15:00Z",
    successRate: 100
  },
  {
    id: "3",
    name: "User Feedback",
    url: "https://discord.com/api/webhooks/456789123/mnopqrstuvwxyzabcdefghijkl",
    channel: "feedback",
    events: ["feedback.submitted"],
    active: false,
    lastTriggered: "2023-06-10T09:45:00Z",
    successRate: 95.2
  }
];

// Available events
const availableEvents = [
  { id: "system.status", name: "System Status Change", description: "Triggered when system status changes" },
  { id: "system.maintenance", name: "Maintenance Announcement", description: "Triggered for scheduled maintenance" },
  { id: "ticket.created", name: "Support Ticket Created", description: "Triggered when a new support ticket is created" },
  { id: "ticket.updated", name: "Support Ticket Updated", description: "Triggered when a support ticket is updated" },
  { id: "ticket.closed", name: "Support Ticket Closed", description: "Triggered when a support ticket is closed" },
  { id: "feedback.submitted", name: "User Feedback Submitted", description: "Triggered when a user submits feedback" },
  { id: "user.joined", name: "User Joined", description: "Triggered when a new user joins" },
  { id: "device.status", name: "Device Status Change", description: "Triggered when a device status changes" }
];

interface DiscordWebhooksProps {
  isConnected: boolean;
}

export function DiscordWebhooks({ isConnected }: DiscordWebhooksProps) {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<any>(null);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookChannel, setNewWebhookChannel] = useState("announcements");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState("");
  
  const handleCreateWebhook = () => {
    if (!newWebhookName || !newWebhookUrl || selectedEvents.length === 0) {
      alert("Please fill in all required fields and select at least one event");
      return;
    }
    
    const newWebhook = {
      id: (webhooks.length + 1).toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      channel: newWebhookChannel,
      events: selectedEvents,
      active: true,
      lastTriggered: null,
      successRate: 100
    };
    
    setWebhooks([...webhooks, newWebhook]);
    setNewWebhookName("");
    setNewWebhookUrl("");
    setNewWebhookChannel("announcements");
    setSelectedEvents([]);
    setIsCreateDialogOpen(false);
  };
  
  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, active: !webhook.active } 
        : webhook
    ));
  };
  
  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
  };
  
  const handleTestWebhook = () => {
    if (!testMessage.trim() || !selectedWebhook) return;
    
    // In a real implementation, this would send a test message to the webhook
    alert(`Test message sent to ${selectedWebhook.name}`);
    
    setTestMessage("");
    setIsTestDialogOpen(false);
  };
  
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Not Connected to Discord</h3>
        <p className="text-muted-foreground mb-6">
          Connect to Discord to manage webhooks and integrations.
        </p>
        <Button variant="outline">Connect to Discord</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Discord Webhooks</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Webhook</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Discord Webhook</DialogTitle>
              <DialogDescription>
                Create a new webhook to send automated messages to your Discord server.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input 
                  id="webhook-name" 
                  placeholder="Enter webhook name" 
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  placeholder="https://discord.com/api/webhooks/..." 
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Create a webhook in your Discord server settings and paste the URL here.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="webhook-channel">Discord Channel</Label>
                <Select value={newWebhookChannel} onValueChange={setNewWebhookChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcements">#announcements</SelectItem>
                    <SelectItem value="support">#support</SelectItem>
                    <SelectItem value="general">#general</SelectItem>
                    <SelectItem value="feedback">#feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Trigger Events</Label>
                <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                  {availableEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`event-${event.id}`} 
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event.id]);
                          } else {
                            setSelectedEvents(selectedEvents.filter(id => id !== event.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <Label htmlFor={`event-${event.id}`} className="text-sm font-medium">
                          {event.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Triggered</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">{webhook.name}</TableCell>
                <TableCell>#{webhook.channel}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={webhook.active} 
                      onCheckedChange={() => handleToggleWebhook(webhook.id)}
                    />
                    <span className={webhook.active ? "text-green-500" : "text-slate-500"}>
                      {webhook.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {webhook.lastTriggered 
                    ? new Date(webhook.lastTriggered).toLocaleString() 
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={
                      webhook.successRate >= 98 ? "text-green-500" :
                      webhook.successRate >= 90 ? "text-amber-500" :
                      "text-red-500"
                    }>
                      {webhook.successRate}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedWebhook(webhook);
                        setIsTestDialogOpen(true);
                      }}
                    >
                      Test
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {webhooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <p className="text-muted-foreground">No webhooks configured</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    Create Your First Webhook
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Performance</CardTitle>
            <CardDescription>
              Monitor the performance of your Discord webhooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Performance chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
            <CardDescription>
              Types of events sent to Discord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Event distribution chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Test Webhook Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Webhook</DialogTitle>
            <DialogDescription>
              Send a test message to the webhook to verify it's working correctly.
            </DialogDescription>
          </DialogHeader>
          
          {selectedWebhook && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Badge>{selectedWebhook.name}</Badge>
                <span className="text-sm text-muted-foreground">#{selectedWebhook.channel}</span>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="test-message">Test Message</Label>
                <Textarea 
                  id="test-message" 
                  placeholder="Enter a test message to send to Discord" 
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to the Discord channel via the webhook. Discord markdown is supported.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTestWebhook}>Send Test Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
