"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock channels data
const mockChannels = [
  {
    id: "1",
    name: "announcements",
    type: "text",
    category: "Information",
    linkedTo: "System Announcements",
    autoPost: true,
    memberCount: 156,
    lastActivity: "2023-06-15T14:30:00Z"
  },
  {
    id: "2",
    name: "support",
    type: "text",
    category: "Support",
    linkedTo: "Support Tickets",
    autoPost: true,
    memberCount: 142,
    lastActivity: "2023-06-16T09:45:00Z"
  },
  {
    id: "3",
    name: "general",
    type: "text",
    category: "General",
    linkedTo: null,
    autoPost: false,
    memberCount: 187,
    lastActivity: "2023-06-16T11:20:00Z"
  },
  {
    id: "4",
    name: "feedback",
    type: "text",
    category: "Feedback",
    linkedTo: "User Feedback",
    autoPost: true,
    memberCount: 98,
    lastActivity: "2023-06-14T16:10:00Z"
  },
  {
    id: "5",
    name: "voice-support",
    type: "voice",
    category: "Support",
    linkedTo: null,
    autoPost: false,
    memberCount: 12,
    lastActivity: "2023-06-15T10:05:00Z"
  }
];

interface DiscordChannelsProps {
  isConnected: boolean;
}

export function DiscordChannels({ isConnected }: DiscordChannelsProps) {
  const [channels, setChannels] = useState(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState("text");
  const [newChannelCategory, setNewChannelCategory] = useState("");
  
  const handleCreateChannel = () => {
    if (!newChannelName) return;
    
    const newChannel = {
      id: (channels.length + 1).toString(),
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      type: newChannelType,
      category: newChannelCategory || "General",
      linkedTo: null,
      autoPost: false,
      memberCount: 0,
      lastActivity: new Date().toISOString()
    };
    
    setChannels([...channels, newChannel]);
    setNewChannelName("");
    setNewChannelType("text");
    setNewChannelCategory("");
    setIsDialogOpen(false);
  };
  
  const handleLinkChannel = (channelId: string, linkTo: string | null) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, linkedTo: linkTo } 
        : channel
    ));
  };
  
  const handleToggleAutoPost = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, autoPost: !channel.autoPost } 
        : channel
    ));
  };
  
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Not Connected to Discord</h3>
        <p className="text-muted-foreground mb-6">
          Connect to Discord to manage channels and integrations.
        </p>
        <Button variant="outline">Connect to Discord</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Discord Channels</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Channel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Discord Channel</DialogTitle>
              <DialogDescription>
                Create a new channel in your Discord server.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input 
                  id="channel-name" 
                  placeholder="Enter channel name" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel-type">Channel Type</Label>
                <Select value={newChannelType} onValueChange={setNewChannelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Channel</SelectItem>
                    <SelectItem value="voice">Voice Channel</SelectItem>
                    <SelectItem value="announcement">Announcement Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel-category">Category</Label>
                <Input 
                  id="channel-category" 
                  placeholder="Enter category name" 
                  value={newChannelCategory}
                  onChange={(e) => setNewChannelCategory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateChannel}>Create Channel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>Auto Post</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell className="font-medium">#{channel.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {channel.type === "text" ? "Text" : channel.type === "voice" ? "Voice" : "Announcement"}
                  </Badge>
                </TableCell>
                <TableCell>{channel.category}</TableCell>
                <TableCell>
                  {channel.linkedTo ? (
                    <Badge className="bg-primary">{channel.linkedTo}</Badge>
                  ) : (
                    <Badge variant="outline">Not Linked</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={channel.autoPost} 
                    onCheckedChange={() => handleToggleAutoPost(channel.id)}
                    disabled={!channel.linkedTo}
                  />
                </TableCell>
                <TableCell>{channel.memberCount}</TableCell>
                <TableCell>
                  {new Date(channel.lastActivity).toLocaleDateString()} {new Date(channel.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedChannel(channel)}>
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage Channel: #{channel.name}</DialogTitle>
                        <DialogDescription>
                          Configure integration settings for this Discord channel.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="link-to">Link to SPEAR Feature</Label>
                          <Select 
                            value={channel.linkedTo || ""} 
                            onValueChange={(value) => handleLinkChannel(channel.id, value || null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select feature to link" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Not Linked</SelectItem>
                              <SelectItem value="System Announcements">System Announcements</SelectItem>
                              <SelectItem value="Support Tickets">Support Tickets</SelectItem>
                              <SelectItem value="User Feedback">User Feedback</SelectItem>
                              <SelectItem value="Status Updates">Status Updates</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-post">Automatic Posting</Label>
                            <p className="text-xs text-muted-foreground">
                              Automatically post updates to this channel
                            </p>
                          </div>
                          <Switch 
                            id="auto-post" 
                            checked={channel.autoPost}
                            onCheckedChange={() => handleToggleAutoPost(channel.id)}
                            disabled={!channel.linkedTo}
                          />
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Channel Statistics</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Members:</p>
                              <p className="font-medium">{channel.memberCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Activity:</p>
                              <p className="font-medium">
                                {new Date(channel.lastActivity).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Send Test Message</Button>
                        <Button>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Activity</CardTitle>
            <CardDescription>
              Overview of channel activity in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Activity chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Performance</CardTitle>
            <CardDescription>
              How well the Discord integration is performing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Message Delivery Rate</p>
                  <p className="text-sm font-medium">98.5%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "98.5%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">API Response Time</p>
                  <p className="text-sm font-medium">245ms</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Webhook Reliability</p>
                  <p className="text-sm font-medium">99.1%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "99.1%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
