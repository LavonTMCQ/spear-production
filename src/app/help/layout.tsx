"use client";

import { Header } from "@/components/layout/header";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/contexts/notification-context";
import { User } from "@/types/user";
import { getUserFromStorage } from "@/utils/storage-utils";
import { Loading } from "@/components/ui/loading";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = getUserFromStorage();
    
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <Loading fullScreen message="Loading help center..." />;
  }

  return (
    <NotificationProvider userRole={user?.role}>
      <div className="flex flex-col h-screen bg-background">
        <Header user={user!} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </NotificationProvider>
  );
}
