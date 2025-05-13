"use client";

import { Header } from "@/components/layout/header";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/contexts/notification-context";
import { User } from "@/types/user";
import { Loading } from "@/components/ui/loading";
import { useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session) {
      router.push("/login");
      return;
    }

    const userData = {
      id: session.user?.id as string,
      name: session.user?.name || "",
      email: session.user?.email || "",
      role: session.user?.role as "ADMIN" | "CLIENT",
    };

    setUser(userData);

    // Redirect non-admin users to client dashboard
    if (userData.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [router, session, status]);

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
