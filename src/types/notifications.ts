export type NotificationType = "alert" | "info" | "success" | "warning";

export type NotificationCategory =
  | "admin"
  | "client"
  | "system"
  | "security"
  | "billing"
  | "device"
  | "user"
  | "subscription"
  | "marketing";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationAction {
  label: string;
  action: "view" | "approve" | "deny" | "dismiss" | "link";
  url?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
  icon?: string;
  image?: string;
}
