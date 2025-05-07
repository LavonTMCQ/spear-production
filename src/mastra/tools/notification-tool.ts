import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Define the notification tool
export const notificationTool = createTool({
  id: "notificationTool", // This ID will be used as the name in tool calls
  description: "Send a notification to users. Use this tool to send notifications to either admin users or client users. Admin notifications are for system alerts and administrative events, while client notifications are for user-specific information.",
  inputSchema: z.object({
    title: z.string().describe("The title of the notification (required)"),
    message: z.string().describe("The message content of the notification (required)"),
    type: z.enum(["alert", "info", "success", "warning"]).default("info").describe("The type of notification (alert, info, success, warning)"),
    category: z.enum(["admin", "client"]).describe("Whether this is an admin or client notification (required)"),
  }),
  execute: async ({ context }) => {
    try {
      // Extract parameters from context
      const { title, message, type = "info", category } = context;

      // Log for debugging
      console.log("Notification tool executed with:", { title, message, type, category });

      // Validate required fields
      if (!title || !message || !category) {
        console.error("Missing required fields for notification");
        throw new Error("Missing required fields for notification");
      }

      // Return the notification data in the format expected by the server action
      return {
        title,
        message,
        type,
        category,
        read: false,
        time: "Just now",
      };
    } catch (error) {
      console.error("Error in notification tool:", error);
      throw error;
    }
  },
});
