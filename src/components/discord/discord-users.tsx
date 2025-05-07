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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock users data
const mockUsers = [
  {
    id: "1",
    username: "JohnDoe",
    discriminator: "1234",
    avatar: "/images/avatars/john.jpg",
    roles: ["Admin", "Support"],
    joinedAt: "2023-01-15T00:00:00.000Z",
    lastActive: "2023-06-16T10:30:00.000Z",
    linkedAccount: "john@example.com",
    isBot: false
  },
  {
    id: "2",
    username: "SPEAR",
    discriminator: "0000",
    avatar: "/images/avatars/spear-bot.jpg",
    roles: ["Bot"],
    joinedAt: "2023-01-10T00:00:00.000Z",
    lastActive: "2023-06-16T16:45:00.000Z",
    linkedAccount: null,
    isBot: true
  },
  {
    id: "3",
    username: "SarahSmith",
    discriminator: "5678",
    avatar: "/images/avatars/sarah.jpg",
    roles: ["Member"],
    joinedAt: "2023-02-20T00:00:00.000Z",
    lastActive: "2023-06-15T14:20:00.000Z",
    linkedAccount: "sarah@example.com",
    isBot: false
  },
  {
    id: "4",
    username: "TechSupport",
    discriminator: "9012",
    avatar: "/images/avatars/tech.jpg",
    roles: ["Support"],
    joinedAt: "2023-03-05T00:00:00.000Z",
    lastActive: "2023-06-16T09:15:00.000Z",
    linkedAccount: "support@example.com",
    isBot: false
  },
  {
    id: "5",
    username: "NewUser",
    discriminator: "3456",
    avatar: "/images/avatars/new.jpg",
    roles: ["Member"],
    joinedAt: "2023-06-10T00:00:00.000Z",
    lastActive: "2023-06-15T11:30:00.000Z",
    linkedAccount: null,
    isBot: false
  }
];

interface DiscordUsersProps {
  isConnected: boolean;
}

export function DiscordUsers({ isConnected }: DiscordUsersProps) {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  
  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.linkedAccount && user.linkedAccount.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });
  
  const handleLinkAccount = (userId: string, email: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, linkedAccount: email } 
        : user
    ));
    setIsUserDialogOpen(false);
  };
  
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Not Connected to Discord</h3>
        <p className="text-muted-foreground mb-6">
          Connect to Discord to manage users and roles.
        </p>
        <Button variant="outline">Connect to Discord</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold">Discord Users</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-64"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Bot">Bot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Linked Account</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}#{user.discriminator}</p>
                      {user.isBot && <Badge variant="outline">Bot</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <Badge key={index} variant={
                        role === "Admin" ? "default" :
                        role === "Support" ? "secondary" :
                        role === "Bot" ? "outline" : "outline"
                      }>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.joinedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()} {new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  {user.linkedAccount ? (
                    <span className="text-sm">{user.linkedAccount}</span>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Not Linked</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsUserDialogOpen(true);
                    }}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <p className="text-muted-foreground">No users found matching your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>
              Overview of Discord server users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Users</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Linked Accounts</span>
                <span className="font-medium">{users.filter(u => u.linkedAccount).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Today</span>
                <span className="font-medium">
                  {users.filter(u => {
                    const today = new Date();
                    const lastActive = new Date(u.lastActive);
                    return lastActive.toDateString() === today.toDateString();
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">New This Week</span>
                <span className="font-medium">
                  {users.filter(u => {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const joinedDate = new Date(u.joinedAt);
                    return joinedDate > oneWeekAgo;
                  }).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>
              User distribution by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Admin</span>
                  </div>
                  <span className="text-sm font-medium">
                    {users.filter(u => u.roles.includes("Admin")).length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${(users.filter(u => u.roles.includes("Admin")).length / users.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-secondary mr-2"></div>
                    <span className="text-sm">Support</span>
                  </div>
                  <span className="text-sm font-medium">
                    {users.filter(u => u.roles.includes("Support")).length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary" 
                    style={{ 
                      width: `${(users.filter(u => u.roles.includes("Support")).length / users.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground mr-2"></div>
                    <span className="text-sm">Member</span>
                  </div>
                  <span className="text-sm font-medium">
                    {users.filter(u => u.roles.includes("Member")).length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-muted-foreground" 
                    style={{ 
                      width: `${(users.filter(u => u.roles.includes("Member")).length / users.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-slate-400 mr-2"></div>
                    <span className="text-sm">Bot</span>
                  </div>
                  <span className="text-sm font-medium">
                    {users.filter(u => u.roles.includes("Bot")).length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400" 
                    style={{ 
                      width: `${(users.filter(u => u.roles.includes("Bot")).length / users.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Linking</CardTitle>
            <CardDescription>
              Link Discord users to SPEAR accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Linking Discord users to SPEAR accounts allows for seamless integration between the platforms.
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Linked Accounts</span>
                <span className="font-medium">{users.filter(u => u.linkedAccount).length}/{users.length}</span>
              </div>
              
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${(users.filter(u => u.linkedAccount).length / users.length) * 100}%` 
                  }}
                ></div>
              </div>
              
              <Button className="w-full" variant="outline" onClick={() => {
                const unlinkedUser = users.find(u => !u.linkedAccount && !u.isBot);
                if (unlinkedUser) {
                  setSelectedUser(unlinkedUser);
                  setIsUserDialogOpen(true);
                }
              }}>
                Link Next Unlinked User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Management Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Discord User</DialogTitle>
            <DialogDescription>
              View and manage user details and account linking.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.username}#{selectedUser.discriminator}</h3>
                  <p className="text-sm text-muted-foreground">User ID: {selectedUser.id}</p>
                </div>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.roles.map((role: string, index: number) => (
                      <Badge key={index} variant={
                        role === "Admin" ? "default" :
                        role === "Support" ? "secondary" :
                        role === "Bot" ? "outline" : "outline"
                      }>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Joined Server</Label>
                    <p className="text-sm">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Last Active</Label>
                    <p className="text-sm">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Linked SPEAR Account</Label>
                  {selectedUser.linkedAccount ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{selectedUser.linkedAccount}</p>
                      <Button variant="ghost" size="sm">Unlink</Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">No linked account</p>
                      <div className="flex space-x-2">
                        <Input placeholder="Enter email address" />
                        <Button onClick={() => handleLinkAccount(selectedUser.id, "user@example.com")}>Link</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-between">
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Ban User
                </Button>
                <Button onClick={() => setIsUserDialogOpen(false)}>Done</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
