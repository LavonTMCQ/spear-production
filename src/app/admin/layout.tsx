"use client";

import { Header } from "@/components/layout/header";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/contexts/notification-context";
import { User } from "@/types/user";
import { Loading } from "@/components/ui/loading";
import { auth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        // Get the session from NextAuth
        const session = await auth();

        if (!session || !session.user) {
          router.push("/login");
          return;
        }

        const userData = {
          id: session.user.id as string,
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role as "ADMIN" | "CLIENT",
        };

        setUser(userData);

        // Redirect non-admin users to client dashboard
        if (userData.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    }

    checkSession();
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
