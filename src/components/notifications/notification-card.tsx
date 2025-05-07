"use client";

import { useState } from "react";
import { Notification } from "@/types/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  ArrowUpIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationCard({ notification, onMarkAsRead, onRemove }: NotificationCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (action: string, url?: string) => {
    setIsLoading(true);

    // Handle different action types
    switch (action) {
      case "view":
      case "link":
        if (url) {
          router.push(url);
        }
        break;
      case "approve":
        toast.success("Request approved");
        onMarkAsRead(notification.id);
        break;
      case "deny":
        toast.info("Request denied");
        onMarkAsRead(notification.id);
        break;
      case "dismiss":
        onRemove(notification.id);
        break;
      default:
        break;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Get the appropriate icon based on notification type
  const getTypeIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "alert":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get the appropriate icon based on notification category
  const getCategoryIcon = () => {
    switch (notification.icon) {
      case "device-phone-mobile":
        return <DevicePhoneMobileIcon className="h-5 w-5" />;
      case "credit-card":
        return <CreditCardIcon className="h-5 w-5" />;
      case "check-circle":
        return <CheckCircleIcon className="h-5 w-5" />;
      case "arrow-up":
        return <ArrowUpIcon className="h-5 w-5" />;
      case "shield-exclamation":
        return <ShieldExclamationIcon className="h-5 w-5" />;
      case "sparkles":
        return <SparklesIcon className="h-5 w-5" />;
      case "user-plus":
        return <UserPlusIcon className="h-5 w-5" />;
      case "exclamation-circle":
        return <ExclamationCircleIcon className="h-5 w-5" />;
      case "x-circle":
        return <XCircleIcon className="h-5 w-5" />;
      case "exclamation-triangle":
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return getTypeIcon();
    }
  };

  // Get the appropriate color for the priority badge
  const getPriorityColor = () => {
    switch (notification.priority) {
      case "urgent":
        return "bg-red-500 hover:bg-red-600";
      case "high":
        return "bg-amber-500 hover:bg-amber-600";
      case "medium":
        return "bg-blue-500 hover:bg-blue-600";
      case "low":
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };

  return (
    <Card className={`mb-2 ${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {getCategoryIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{notification.title}</h4>
                {notification.priority && (
                  <Badge className={`text-xs ${getPriorityColor()}`}>
                    {notification.priority}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(notification.id)}
          >
            <XMarkIcon className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>

        {notification.image && (
          <div className="mt-3">
            <img
              src={notification.image}
              alt={notification.title}
              className="rounded-md w-full h-32 object-cover"
            />
          </div>
        )}
      </CardContent>

      {notification.actions && notification.actions.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
          {notification.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.action === "approve" ? "default" :
                     action.action === "deny" ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleAction(action.action, action.url)}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}

          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              disabled={isLoading}
            >
              Mark as read
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
