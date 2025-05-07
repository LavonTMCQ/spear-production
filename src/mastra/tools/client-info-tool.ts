import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock client data - in a real app, this would come from a database
const mockClients = [
  {
    id: "client1",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    subscription: {
      plan: "Enterprise",
      status: "Active",
      devices: 15,
      startDate: "2023-01-15",
      endDate: "2024-01-15",
    },
    lastActive: "2023-11-10",
  },
  {
    id: "client2",
    name: "TechStart Inc",
    email: "admin@techstart.io",
    subscription: {
      plan: "Professional",
      status: "Active",
      devices: 5,
      startDate: "2023-03-22",
      endDate: "2024-03-22",
    },
    lastActive: "2023-11-12",
  },
  {
    id: "client3",
    name: "Global Solutions Ltd",
    email: "info@globalsolutions.com",
    subscription: {
      plan: "Basic",
      status: "Expired",
      devices: 2,
      startDate: "2023-02-10",
      endDate: "2023-10-10",
    },
    lastActive: "2023-10-05",
  },
];

export const clientInfoTool = createTool({
  id: "clientInfoTool",
  description: "Get information about clients, including their subscription status and device usage.",
  inputSchema: z.object({
    clientId: z.string().optional().describe("The ID of the specific client to look up. If not provided, returns information about all clients."),
    includeSubscription: z.boolean().default(true).describe("Whether to include subscription details in the response."),
  }),
  execute: async ({ context }) => {
    try {
      const { clientId, includeSubscription = true } = context;
      
      // Log for debugging
      console.log("Client info tool executed with:", { clientId, includeSubscription });
      
      // If a specific client ID is provided, return that client's info
      if (clientId) {
        const client = mockClients.find(c => c.id === clientId);
        
        if (!client) {
          return {
            success: false,
            message: `No client found with ID: ${clientId}`,
          };
        }
        
        // Return the client info, optionally including subscription details
        return {
          success: true,
          client: includeSubscription ? client : {
            id: client.id,
            name: client.name,
            email: client.email,
            lastActive: client.lastActive,
          },
        };
      }
      
      // If no specific client ID is provided, return all clients
      return {
        success: true,
        clients: mockClients.map(client => includeSubscription ? client : {
          id: client.id,
          name: client.name,
          email: client.email,
          lastActive: client.lastActive,
        }),
      };
    } catch (error) {
      console.error("Error in client info tool:", error);
      return {
        success: false,
        message: "An error occurred while retrieving client information.",
      };
    }
  },
});
