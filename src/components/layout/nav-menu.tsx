"use client";

import { useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import { removeUserFromStorage } from "@/utils/storage-utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HomeIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  SparklesIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  BanknotesIcon,
  UserIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface NavMenuProps {
  role: UserRole | string;
}

function NavMenuComponent({ role }: NavMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    removeUserFromStorage();
    router.push("/login");
  }, [router]);

  const clientLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: UserIcon,
    },
    {
      name: "Session Recordings",
      href: "/dashboard/recordings",
      icon: VideoCameraIcon,
    },
    {
      name: "My Devices",
      href: "/dashboard/devices",
      icon: DevicePhoneMobileIcon,
    },
    {
      name: "Subscription",
      href: "/dashboard/subscription",
      icon: CreditCardIcon,
    },
    {
      name: "Help & Support",
      href: "/help",
      icon: QuestionMarkCircleIcon,
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: HomeIcon,
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: UserIcon,
    },
    {
      name: "Clients",
      href: "/admin/clients",
      icon: UsersIcon,
    },
    {
      name: "Devices",
      href: "/admin/devices",
      icon: DevicePhoneMobileIcon,
    },
    {
      name: "TeamViewer Integration",
      href: "/admin/integrations",
      icon: LinkIcon,
    },

    {
      name: "Discord Integration",
      href: "/admin/discord",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "Service Health",
      href: "/admin/service-health",
      icon: ChartBarIcon,
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCardIcon,
    },
    {
      name: "Revenue & Analytics",
      href: "/admin/revenue",
      icon: BanknotesIcon,
    },
    {
      name: "Blog Management",
      href: "/admin/blog",
      icon: PencilSquareIcon,
    },
    {
      name: "AI Assistant",
      href: "/admin/assistant",
      icon: SparklesIcon,
    },
    {
      name: "SEO & Marketing",
      href: "/admin/seo",
      icon: MagnifyingGlassIcon,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Cog6ToothIcon,
    },
    {
      name: "Help & Support",
      href: "/help",
      icon: QuestionMarkCircleIcon,
    },
  ];

  const links = role === "ADMIN" ? adminLinks : clientLinks;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bars3Icon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Image
            src="/images/spear-logo.PNG"
            alt="SPEAR Logo"
            width={24}
            height={24}
          />
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">SPEAR</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center w-full",
                  isActive && "font-medium"
                )}
              >
                <Icon className={cn("h-4 w-4 mr-2", isActive && "text-primary")} />
                {link.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export the memoized component to prevent unnecessary re-renders
export const NavMenu = memo(NavMenuComponent);