"use client";

import { Header } from "@/components/layout/header";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/contexts/notification-context";
import { User } from "@/types/user";
import { getUserFromStorage } from "@/utils/storage-utils";
import { Loading } from "@/components/ui/loading";

export default function AdminLayout({
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

    // Redirect non-admin users to client dashboard
    if (userData.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <Loading fullScreen message="Loading admin dashboard..." />;
  }

  return (
    <NotificationProvider userRole={user?.role}>
      <div className="flex flex-col h-screen bg-background">
        <Header user={user || {}} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </NotificationProvider>
  );
}
