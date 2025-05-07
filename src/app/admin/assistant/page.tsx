"use client";

import { AdminAssistant } from "@/components/admin/admin-assistant";

export default function AdminAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Get help with administrative tasks and send notifications
        </p>
      </div>
      
      <AdminAssistant />
    </div>
  );
}
