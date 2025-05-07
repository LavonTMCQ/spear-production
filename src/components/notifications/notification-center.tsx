"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationCard } from "./notification-card";
import { useNotifications } from "@/contexts/notification-context";
import { MagnifyingGlassIcon, FunnelIcon, BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";

export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique categories from notifications
  const categories = Array.from(
    new Set(notifications.map((notification) => notification.category))
  );
  
  // Get unique priorities from notifications
  const priorities = Array.from(
    new Set(
      notifications
        .filter((notification) => notification.priority)
        .map((notification) => notification.priority)
    )
  );
  
  // Filter notifications based on search query, category, and priority
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === null || notification.category === selectedCategory;
    
    const matchesPriority =
      selectedPriority === null || notification.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });
  
  // Get unread notifications
  const unreadNotifications = filteredNotifications.filter(
    (notification) => !notification.read
  );
  
  // Get read notifications
  const readNotifications = filteredNotifications.filter(
    (notification) => notification.read
  );
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <BellSlashIcon className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-4 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Priority</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  variant={selectedPriority === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPriority(null)}
                >
                  All
                </Button>
                {priorities.map((priority) => (
                  <Button
                    key={priority}
                    variant={selectedPriority === priority ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPriority(priority as string)}
                  >
                    {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="unread">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredNotifications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <BellIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No unread notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {unreadNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <BellIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any notifications yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unreadNotifications.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground">Unread</h3>
                    <div className="space-y-2">
                      {unreadNotifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onRemove={removeNotification}
                        />
                      ))}
                    </div>
                    {readNotifications.length > 0 && <Separator className="my-4" />}
                  </>
                )}
                
                {readNotifications.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground">Read</h3>
                    <div className="space-y-2">
                      {readNotifications.map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onRemove={removeNotification}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
