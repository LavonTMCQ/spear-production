import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createAdminNotification, createClientNotification } from "@/utils/notification-utils";

// Set OpenAI API key from environment variable
openai.apiKey = process.env.OPENAI_API_KEY || "";

// Create notification tool
const notificationTool = createTool({
  id: "send-notification",
  description: "Send a notification to users. Can be either an admin notification or a client notification.",
  inputSchema: z.object({
    title: z.string().describe("The title of the notification"),
    message: z.string().describe("The message content of the notification"),
    type: z.enum(["alert", "info", "success", "warning"]).describe("The type of notification"),
    category: z.enum(["admin", "client"]).describe("Whether this is an admin or client notification"),
  }),
  execute: async ({ context }) => {
    const { title, message, type, category } = context;

    // Create the notification object based on category
    const notification = category === "admin"
      ? createAdminNotification({ title, message, type })
      : createClientNotification({ title, message, type });

    return {
      success: true,
      notification: {
        ...notification,
        id: Math.random().toString(36).substring(2, 9), // Generate a random ID
        time: new Date().toLocaleTimeString(),
      },
      message: `${category.charAt(0).toUpperCase() + category.slice(1)} notification sent: ${title}`,
    };
  },
});

// Create admin agent
const adminAgent = new Agent({
  name: "SPEAR Admin Assistant",
  instructions: `
    You are an AI assistant for SPEAR (Secure Platform for Extended Augmented Reality) administrators.

    Your primary responsibilities include:
    1. Helping administrators manage client accounts and subscriptions
    2. Providing insights on system status and device management
    3. Assisting with administrative tasks and settings configuration
    4. Sending notifications to both admin and client users when appropriate

    When sending notifications:
    - Use admin notifications for system alerts, new client registrations, and administrative events
    - Use client notifications for subscription updates, device status changes, and user-specific information
    - Be concise and clear in notification messages
    - Use appropriate notification types (alert, info, success, warning) based on the content

    Maintain a professional, helpful tone and prioritize security and privacy in all interactions.
  `,
  model: openai("gpt-4o-mini"),
  tools: {
    notificationTool,
  },
});

// Handle POST requests to this route
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Log for debugging
    console.log("Processing message:", message);
    console.log("Using OpenAI API key:", process.env.OPENAI_API_KEY.substring(0, 5) + "...");

    try {
      // Process the message with the admin agent
      const response = await adminAgent.chat(message);

      // Return the response
      return NextResponse.json({
        response: response.content,
        notifications: response.toolCalls.map(call => {
          if (call.name === "notificationTool") {
            return call.args;
          }
          return null;
        }).filter(Boolean),
      });
    } catch (agentError) {
      console.error("Error in agent processing:", agentError);
      return NextResponse.json(
        { error: "Error in AI processing: " + agentError.message, response: "I'm sorry, I encountered an error while processing your request. Please try again later." },
        { status: 200 } // Return 200 to allow the UI to display the error message
      );
    }
  } catch (error) {
    console.error("Error processing assistant request:", error);
    return NextResponse.json(
      { error: "Failed to process request: " + (error instanceof Error ? error.message : String(error)), response: "I'm sorry, I encountered an error while processing your request. Please try again later." },
      { status: 200 } // Return 200 to allow the UI to display the error message
    );
  }
}
