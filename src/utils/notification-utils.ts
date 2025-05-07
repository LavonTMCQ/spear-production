import { Notification } from "@/types/notifications";

// Function to create a new notification object
export function createNotification({
  title,
  message,
  type = "info",
  category,
}: {
  title: string;
  message: string;
  type?: "alert" | "info" | "success" | "warning";
  category: "admin" | "client";
}): Omit<Notification, "id"> {
  return {
    title,
    message,
    time: "Just now",
    read: false,
    type,
    category,
  };
}

// Example usage for adding admin notifications
export function createAdminNotification({
  title,
  message,
  type = "info",
}: {
  title: string;
  message: string;
  type?: "alert" | "info" | "success" | "warning";
}): Omit<Notification, "id"> {
  return createNotification({
    title,
    message,
    type,
    category: "admin",
  });
}

// Example usage for adding client notifications
export function createClientNotification({
  title,
  message,
  type = "info",
}: {
  title: string;
  message: string;
  type?: "alert" | "info" | "success" | "warning";
}): Omit<Notification, "id"> {
  return createNotification({
    title,
    message,
    type,
    category: "client",
  });
}
