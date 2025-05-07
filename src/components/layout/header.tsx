"use client";

import { memo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeUserFromStorage } from "@/utils/storage-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavMenu } from "@/components/layout/nav-menu";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNotifications } from "@/contexts/notification-context";
import { NotificationCenter } from "@/components/notifications/notification-center";

import { User, UserRole } from "@/types/user";

interface HeaderProps {
  user: Partial<User>;
}

function HeaderComponent({ user }: HeaderProps) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  // Notifications are managed by the useNotifications hook

  const handleLogout = useCallback(() => {
    removeUserFromStorage();
    router.push("/login");
  }, [router]);

  // Handler for notification bell click - opens the notification panel
  const handleNotificationBellClick = () => {
    // The Sheet component handles the open/close state
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user.email?.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
      <div className="flex items-center space-x-4">
        <NavMenu role={user.role || "CLIENT"} />
        <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
          <Image
            src="/images/spear-logo.PNG"
            alt="SPEAR Logo"
            width={32}
            height={32}
            className="hidden sm:block"
          />
          <h1 className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">SPEAR</span>
          </h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationBellClick}>
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[380px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{user.role === "ADMIN" ? "Admin Notifications" : "Notifications"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <NotificationCenter />
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// Export the memoized component to prevent unnecessary re-renders
export const Header = memo(HeaderComponent);