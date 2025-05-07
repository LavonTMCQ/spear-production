import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock system status data - in a real app, this would come from monitoring services
const mockSystemStatus = {
  server: {
    status: "Operational",
    uptime: "99.98%",
    lastIncident: "2023-10-05",
    currentLoad: "32%",
  },
  database: {
    status: "Operational",
    responseTime: "45ms",
    connections: 128,
  },
  services: [
    {
      name: "Authentication Service",
      status: "Operational",
      uptime: "99.99%",
    },
    {
      name: "Device Connection Service",
      status: "Operational",
      uptime: "99.95%",
    },
    {
      name: "Subscription Management",
      status: "Operational",
      uptime: "100%",
    },
    {
      name: "Analytics Service",
      status: "Degraded Performance",
      uptime: "98.5%",
      issue: "High load causing slower response times",
    },
  ],
  activeConnections: 256,
  activeDevices: 78,
  lastUpdated: new Date().toISOString(),
};

export const systemStatusTool = createTool({
  id: "systemStatusTool",
  description: "Get information about the current system status, including server health, active connections, and service status.",
  inputSchema: z.object({
    component: z.enum(["all", "server", "database", "services"]).default("all").describe("The specific component to get status for. Defaults to 'all' which returns the full system status."),
  }),
  execute: async ({ context }) => {
    try {
      const { component = "all" } = context;
      
      // Log for debugging
      console.log("System status tool executed with:", { component });
      
      // Return the requested component status
      switch (component) {
        case "server":
          return {
            success: true,
            server: mockSystemStatus.server,
            lastUpdated: mockSystemStatus.lastUpdated,
          };
        case "database":
          return {
            success: true,
            database: mockSystemStatus.database,
            lastUpdated: mockSystemStatus.lastUpdated,
          };
        case "services":
          return {
            success: true,
            services: mockSystemStatus.services,
            lastUpdated: mockSystemStatus.lastUpdated,
          };
        case "all":
        default:
          return {
            success: true,
            status: mockSystemStatus,
          };
      }
    } catch (error) {
      console.error("Error in system status tool:", error);
      return {
        success: false,
        message: "An error occurred while retrieving system status information.",
      };
    }
  },
});
