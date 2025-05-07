"use client";

import { Notification } from "@/types/notifications";
import { adminNotifications, clientNotifications } from "@/data/notifications";
import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { UserRole } from "@/types/user";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  userRole: UserRole | string | null | undefined;
}

export function NotificationProvider({
  children,
  userRole
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load the appropriate notifications based on user role
  useEffect(() => {
    if (userRole === "ADMIN") {
      setNotifications(adminNotifications);
    } else {
      setNotifications(clientNotifications);
    }
  }, [userRole]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Memoize functions to prevent unnecessary re-renders
  const markAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications => prevNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications => prevNotifications.map(notification =>
      ({ ...notification, read: true })
    ));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
    };

    // Update the notifications state
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
  }), [
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
