"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

// Mock messages data
const mockMessages = [
  {
    id: "1",
    content: "🚨 **Service Alert**: TeamViewer API is experiencing degraded performance. Our team is investigating the issue.",
    channel: "announcements",
    sender: "SPEAR Bot",
    type: "alert",
    sentAt: "2023-06-16T14:30:00Z",
    reactions: 3,
    replies: 0
  },
  {
    id: "2",
    content: "📣 **New Feature**: Enhanced TeamViewer integration is now available! Check out the documentation to get started.",
    channel: "announcements",
    sender: "SPEAR Bot",
    type: "announcement",
    sentAt: "2023-06-15T10:15:00Z",
    reactions: 12,
    replies: 5
  },
  {
    id: "3",
    content: "I'm having trouble connecting to my device through TeamViewer. Can someone help?",
    channel: "support",
    sender: "User123",
    type: "support",
    sentAt: "2023-06-16T09:45:00Z",
    reactions: 0,
    replies: 3
  },
  {
    id: "4",
    content: "✅ **Service Restored**: TeamViewer API is now operating normally. Thank you for your patience.",
    channel: "announcements",
    sender: "SPEAR Bot",
    type: "alert",
    sentAt: "2023-06-16T16:20:00Z",
    reactions: 8,
    replies: 0
  },
  {
    id: "5",
    content: "How do I set up automatic device provisioning with TeamViewer?",
    channel: "support",
    sender: "TechAdmin",
    type: "support",
    sentAt: "2023-06-14T11:30:00Z",
    reactions: 1,
    replies: 4
  }
];

// Message templates
const messageTemplates = [
  {
    id: "1",
    name: "Service Outage Alert",
    content: "🚨 **Service Alert**: {service} is experiencing an outage. Our team is investigating the issue. We'll provide updates as soon as possible.",
    channel: "announcements",
    type: "alert"
  },
  {
    id: "2",
    name: "Service Degraded Performance",
    content: "⚠️ **Service Degraded**: {service} is currently experiencing degraded performance. Our team is working to resolve the issue.",
    channel: "announcements",
    type: "alert"
  },
  {
    id: "3",
    name: "Service Restored",
    content: "✅ **Service Restored**: {service} is now operating normally. Thank you for your patience.",
    channel: "announcements",
    type: "alert"
  },
  {
    id: "4",
    name: "New Feature Announcement",
    content: "📣 **New Feature**: {feature} is now available! Check out the documentation to get started: {link}",
    channel: "announcements",
    type: "announcement"
  },
  {
    id: "5",
    name: "Maintenance Announcement",
    content: "🔧 **Scheduled Maintenance**: We will be performing maintenance on {date} from {start_time} to {end_time}. Service disruptions may occur during this period.",
    channel: "announcements",
    type: "announcement"
  }
];

interface DiscordMessagesProps {
  isConnected: boolean;
}

export function DiscordMessages({ isConnected }: DiscordMessagesProps) {
  const [messages, setMessages] = useState(mockMessages);
  const [templates, setTemplates] = useState(messageTemplates);
  const [activeTab, setActiveTab] = useState("sent");
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("announcements");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: (messages.length + 1).toString(),
      content: newMessage,
      channel: selectedChannel,
      sender: "SPEAR Bot",
      type: "announcement",
      sentAt: new Date().toISOString(),
      reactions: 0,
      replies: 0
    };

    setMessages([newMsg, ...messages]);
    setNewMessage("");
    setIsComposeOpen(false);
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setNewMessage(template.content);
      setSelectedChannel(template.channel);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Not Connected to Discord</h3>
        <p className="text-muted-foreground mb-6">
          Connect to Discord to manage messages and announcements.
        </p>
        <Button variant="outline">Connect to Discord</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Discord Messages</h3>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>Compose Message</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Discord Message</DialogTitle>
              <DialogDescription>
                Create and send a message to your Discord server.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="template">Message Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  handleSelectTemplate(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or write your own" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Template</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="channel">Channel</Label>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
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
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message content. Markdown is supported."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{variable}"} placeholders for dynamic content. Supports Discord markdown formatting.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Message Preview</h4>
                <div className="bg-card p-3 rounded-md border">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                      <span className="text-xs font-bold">SB</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">SPEAR Bot</p>
                      <p className="text-xs text-muted-foreground">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {newMessage || "Your message will appear here..."}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sent">Sent Messages</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Messages</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Input placeholder="Search messages..." className="max-w-sm" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="announcements">#announcements</SelectItem>
                <SelectItem value="support">#support</SelectItem>
                <SelectItem value="general">#general</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-start p-4 border-b">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                      <span className="text-xs font-bold">
                        {message.sender === "SPEAR Bot" ? "SB" : message.sender.substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="font-medium">{message.sender}</p>
                          <Badge className="ml-2" variant={message.type === "alert" ? "destructive" : "default"}>
                            {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.sentAt).toLocaleDateString()} {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          {message.reactions} reactions
                        </span>
                        <span className="flex items-center ml-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          {message.replies} replies
                        </span>
                        <span className="ml-3">#{message.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/30 px-4 py-2 flex justify-end">
                    <Button variant="ghost" size="sm">Resend</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="pt-4">
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No Scheduled Messages</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any messages scheduled for future delivery.
            </p>
            <Button onClick={() => setIsComposeOpen(true)}>Schedule a Message</Button>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">#{template.channel}</Badge>
                  </div>
                  <CardDescription>Template ID: {template.id}</CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="bg-muted/30 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {template.content}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      handleSelectTemplate(template.id);
                      setIsComposeOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Automated Messages</CardTitle>
          <CardDescription>
            Configure automatic messages based on system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Service Status Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically post when service status changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Feature Announcements</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically announce new features
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications before scheduled maintenance
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Support Ticket Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Post updates when support tickets change status
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
