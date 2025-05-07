"use client";

import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/notification-context";
import { createAdminNotification, createClientNotification } from "@/utils/notification-utils";

export function NotificationDemo() {
  const { addNotification } = useNotifications();

  const handleAddAdminNotification = () => {
    addNotification(
      createAdminNotification({
        title: "New Admin Notification",
        message: "This is a test admin notification.",
        type: "info",
      })
    );
  };

  const handleAddClientNotification = () => {
    addNotification(
      createClientNotification({
        title: "New Client Notification",
        message: "This is a test client notification.",
        type: "success",
      })
    );
  };

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Notification Testing</h3>
      <p className="text-sm text-muted-foreground">
        Use these buttons to test adding different types of notifications
      </p>
      <div className="flex space-x-4">
        <Button onClick={handleAddAdminNotification} variant="outline">
          Add Admin Notification
        </Button>
        <Button onClick={handleAddClientNotification} variant="outline">
          Add Client Notification
        </Button>
      </div>
    </div>
  );
}
