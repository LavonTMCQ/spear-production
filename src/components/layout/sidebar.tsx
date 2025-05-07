"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  VideoCameraIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const clientLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
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
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: HomeIcon,
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
  ];

  const links = role === "ADMIN" ? adminLinks : clientLinks;

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground w-64 p-4 dark:bg-slate-900 dark:text-white">
      <div className="mb-8 px-4">
        <Link href={role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center space-x-3">
          <Image
            src="/images/spear-logo.PNG"
            alt="SPEAR Logo"
            width={40}
            height={40}
            className="drop-shadow-sm"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">SPEAR</h1>
        </Link>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-slate-800 transition-colors",
                pathname === link.href ? "bg-accent/80 text-accent-foreground dark:bg-slate-800" : "transparent"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
          onClick={handleLogout}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
