import { Notification } from "@/types/notifications";

// Client-specific notifications
export const clientNotifications: Notification[] = [
  {
    id: "c1",
    title: "Device Offline",
    message: "My Primary Device has gone offline.",
    time: "10 minutes ago",
    read: false,
    type: "alert",
    category: "device",
    priority: "high",
    actions: [
      {
        label: "Check Device",
        action: "view",
        url: "/dashboard/devices"
      },
      {
        label: "Troubleshoot",
        action: "link",
        url: "/help/device-troubleshooting"
      }
    ],
    icon: "device-phone-mobile"
  },
  {
    id: "c2",
    title: "Subscription Renewal",
    message: "Your subscription will renew in 3 days.",
    time: "2 hours ago",
    read: false,
    type: "info",
    category: "billing",
    priority: "medium",
    actions: [
      {
        label: "View Subscription",
        action: "link",
        url: "/dashboard/subscription"
      }
    ],
    icon: "credit-card"
  },
  {
    id: "c3",
    title: "Payment Successful",
    message: "Your payment of $350.00 was successful.",
    time: "Yesterday",
    read: true,
    type: "success",
    category: "billing",
    priority: "low",
    actions: [
      {
        label: "View Receipt",
        action: "link",
        url: "/dashboard/subscription/receipts"
      }
    ],
    icon: "check-circle"
  },
  {
    id: "c4",
    title: "System Update",
    message: "SPEAR was updated to version 2.1.0.",
    time: "3 days ago",
    read: true,
    type: "info",
    category: "system",
    priority: "low",
    actions: [
      {
        label: "View Changes",
        action: "link",
        url: "/help/release-notes"
      }
    ],
    icon: "arrow-up"
  },
  {
    id: "c5",
    title: "Security Alert",
    message: "Unusual login detected from a new location.",
    time: "4 days ago",
    read: true,
    type: "warning",
    category: "security",
    priority: "high",
    actions: [
      {
        label: "Review Activity",
        action: "link",
        url: "/dashboard/profile"
      },
      {
        label: "Secure Account",
        action: "link",
        url: "/dashboard/profile?tab=security"
      }
    ],
    icon: "shield-exclamation"
  },
  {
    id: "c6",
    title: "New Feature Available",
    message: "Try our new screen recording feature during remote sessions.",
    time: "1 week ago",
    read: true,
    type: "info",
    category: "marketing",
    priority: "low",
    actions: [
      {
        label: "Learn More",
        action: "link",
        url: "/help/features/screen-recording"
      }
    ],
    icon: "sparkles",
    image: "/images/features/screen-recording.jpg"
  }
];

// Admin-specific notifications
export const adminNotifications: Notification[] = [
  {
    id: "a1",
    title: "New Client Registration",
    message: "John Smith has registered a new account.",
    time: "5 minutes ago",
    read: false,
    type: "info",
    category: "user",
    priority: "medium",
    actions: [
      {
        label: "View Client",
        action: "link",
        url: "/admin/clients?id=john-smith"
      },
      {
        label: "Approve",
        action: "approve"
      }
    ],
    icon: "user-plus"
  },
  {
    id: "a2",
    title: "Payment Failed",
    message: "Payment for client Sarah Johnson has failed.",
    time: "1 hour ago",
    read: false,
    type: "alert",
    category: "billing",
    priority: "high",
    actions: [
      {
        label: "View Details",
        action: "link",
        url: "/admin/subscriptions?id=sarah-johnson"
      },
      {
        label: "Contact Client",
        action: "link",
        url: "/admin/clients/message?id=sarah-johnson"
      }
    ],
    icon: "exclamation-circle"
  },
  {
    id: "a3",
    title: "Subscription Canceled",
    message: "Client Michael Brown has canceled their subscription.",
    time: "Yesterday",
    read: true,
    type: "warning",
    category: "subscription",
    priority: "medium",
    actions: [
      {
        label: "View Details",
        action: "link",
        url: "/admin/subscriptions?id=michael-brown"
      },
      {
        label: "Contact Client",
        action: "link",
        url: "/admin/clients/message?id=michael-brown"
      }
    ],
    icon: "x-circle"
  },
  {
    id: "a4",
    title: "System Maintenance",
    message: "Scheduled maintenance completed successfully.",
    time: "2 days ago",
    read: true,
    type: "success",
    category: "system",
    priority: "low",
    actions: [
      {
        label: "View Report",
        action: "link",
        url: "/admin/service-health/maintenance"
      }
    ],
    icon: "check-circle"
  },
  {
    id: "a5",
    title: "TeamViewer API Issue",
    message: "TeamViewer API authentication endpoint is experiencing outages.",
    time: "3 hours ago",
    read: false,
    type: "alert",
    category: "system",
    priority: "urgent",
    actions: [
      {
        label: "View Status",
        action: "link",
        url: "/admin/integrations"
      },
      {
        label: "Contact Support",
        action: "link",
        url: "/admin/support/teamviewer"
      }
    ],
    icon: "exclamation-triangle"
  },
  {
    id: "a6",
    title: "New Device Provisioning Request",
    message: "Client Jane Doe has requested a new device provisioning.",
    time: "6 hours ago",
    read: false,
    type: "info",
    category: "device",
    priority: "medium",
    actions: [
      {
        label: "Review Request",
        action: "link",
        url: "/admin/devices/provision"
      },
      {
        label: "Approve",
        action: "approve"
      },
      {
        label: "Deny",
        action: "deny"
      }
    ],
    icon: "device-phone-mobile"
  }
];
