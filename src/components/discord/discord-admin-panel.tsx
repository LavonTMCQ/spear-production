"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiscordMessages } from "@/components/discord/discord-messages";
import { DiscordChannels } from "@/components/discord/discord-channels";
import { DiscordUsers } from "@/components/discord/discord-users";
import { DiscordWebhooks } from "@/components/discord/discord-webhooks";

export function DiscordAdminPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [botToken, setBotToken] = useState("");
  const [guildId, setGuildId] = useState("");
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [supportTickets, setSupportTickets] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  // Mock connection to Discord
  const handleConnect = () => {
    if (!webhookUrl || !botToken || !guildId) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsConnected(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Discord Integration</CardTitle>
            <CardDescription>
              Connect SPEAR with Discord for enhanced communication and support
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "success" : "destructive"} className={isConnected ? "bg-green-500" : ""}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading ? "Disconnecting..." : "Disconnect"}
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {!isConnected ? (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-2">Connect to Discord</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect SPEAR to your Discord server to enable real-time notifications, support tickets, and community engagement.
                  </p>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-url">Discord Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a webhook in your Discord server settings and paste the URL here.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bot-token">Bot Token</Label>
                      <Input
                        id="bot-token"
                        type="password"
                        placeholder="Bot token from Discord Developer Portal"
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a bot in the Discord Developer Portal and paste its token here.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="guild-id">Server ID</Label>
                      <Input
                        id="guild-id"
                        placeholder="Your Discord server ID"
                        value={guildId}
                        onChange={(e) => setGuildId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enable Developer Mode in Discord, right-click your server and copy ID.
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleConnect}
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Connect to Discord"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Real-time Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Send automated notifications about system events, alerts, and updates to your Discord server.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Support Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Allow users to create support tickets directly from Discord and track them in SPEAR.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Community Building</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create a community around your product with dedicated channels for discussions, feedback, and announcements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Server</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SPEAR Community</p>
                          <p className="text-sm text-muted-foreground">ID: {guildId.substring(0, 10)}...</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">#announcements</p>
                          <Badge variant="outline">Linked</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">#support</p>
                          <Badge variant="outline">Linked</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">#general</p>
                          <Badge variant="outline">Linked</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Bot Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SPEAR Bot</p>
                          <p className="text-sm text-muted-foreground">Online for 3 days</p>
                        </div>
                        <Badge className="bg-green-500">Online</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Integration Settings</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-notifications">Automatic Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send system notifications to Discord automatically
                        </p>
                      </div>
                      <Switch
                        id="auto-notifications"
                        checked={autoNotifications}
                        onCheckedChange={setAutoNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="support-tickets">Support Tickets</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to create support tickets from Discord
                        </p>
                      </div>
                      <Switch
                        id="support-tickets"
                        checked={supportTickets}
                        onCheckedChange={setSupportTickets}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="status-alerts">Status Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Send alerts when service status changes
                        </p>
                      </div>
                      <Switch
                        id="status-alerts"
                        checked={statusAlerts}
                        onCheckedChange={setStatusAlerts}
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid gap-2">
                        <Label htmlFor="notification-channel">Default Notification Channel</Label>
                        <Select defaultValue="announcements">
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcements">#announcements</SelectItem>
                            <SelectItem value="general">#general</SelectItem>
                            <SelectItem value="support">#support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="test-message">Send Test Message</Label>
                      <div className="flex space-x-2">
                        <Input id="test-message" placeholder="Enter a test message" />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13"></path>
                          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">System notification sent</p>
                        <p className="text-xs text-muted-foreground">Service status update sent to #announcements</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">New support ticket created</p>
                        <p className="text-xs text-muted-foreground">User requested help with TeamViewer connection</p>
                        <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user joined</p>
                        <p className="text-xs text-muted-foreground">User JohnDoe#1234 joined the server</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="channels">
            <DiscordChannels isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="messages">
            <DiscordMessages isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="users">
            <DiscordUsers isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="webhooks">
            <DiscordWebhooks isConnected={isConnected} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Documentation</Button>
        <Button onClick={isConnected ? handleDisconnect : handleConnect} disabled={isLoading}>
          {isConnected
            ? (isLoading ? "Disconnecting..." : "Disconnect from Discord")
            : (isLoading ? "Connecting..." : "Connect to Discord")}
        </Button>
      </CardFooter>
    </Card>
  );
}
