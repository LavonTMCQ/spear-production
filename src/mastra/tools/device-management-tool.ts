import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock device data - in a real app, this would come from a database
const mockDevices = [
  {
    id: "device1",
    name: "Office Pixel 5",
    clientId: "client1",
    clientName: "Acme Corporation",
    status: "Online",
    lastConnection: "2023-11-12T14:32:00Z",
    batteryLevel: "78%",
    firmwareVersion: "1.2.5",
    location: "New York Office",
  },
  {
    id: "device2",
    name: "Conference Room Pixel 5",
    clientId: "client1",
    clientName: "Acme Corporation",
    status: "Offline",
    lastConnection: "2023-11-10T09:15:00Z",
    batteryLevel: "22%",
    firmwareVersion: "1.2.4",
    location: "New York Office",
  },
  {
    id: "device3",
    name: "Field Pixel 5",
    clientId: "client2",
    clientName: "TechStart Inc",
    status: "Online",
    lastConnection: "2023-11-12T16:45:00Z",
    batteryLevel: "92%",
    firmwareVersion: "1.2.5",
    location: "Chicago Branch",
  },
  {
    id: "device4",
    name: "Demo Pixel 5",
    clientId: "client3",
    clientName: "Global Solutions Ltd",
    status: "Maintenance",
    lastConnection: "2023-11-05T11:20:00Z",
    batteryLevel: "45%",
    firmwareVersion: "1.2.3",
    location: "London Office",
  },
];

export const deviceManagementTool = createTool({
  id: "deviceManagementTool",
  description: "Get information about connected devices, including their status, client association, and technical details.",
  inputSchema: z.object({
    deviceId: z.string().optional().describe("The ID of the specific device to look up. If not provided, returns information about all devices."),
    clientId: z.string().optional().describe("Filter devices by client ID. If provided, returns only devices associated with this client."),
    status: z.enum(["Online", "Offline", "Maintenance", "All"]).default("All").describe("Filter devices by status."),
  }),
  execute: async ({ context }) => {
    try {
      const { deviceId, clientId, status = "All" } = context;
      
      // Log for debugging
      console.log("Device management tool executed with:", { deviceId, clientId, status });
      
      // If a specific device ID is provided, return that device's info
      if (deviceId) {
        const device = mockDevices.find(d => d.id === deviceId);
        
        if (!device) {
          return {
            success: false,
            message: `No device found with ID: ${deviceId}`,
          };
        }
        
        return {
          success: true,
          device,
        };
      }
      
      // Filter devices based on provided parameters
      let filteredDevices = [...mockDevices];
      
      if (clientId) {
        filteredDevices = filteredDevices.filter(d => d.clientId === clientId);
      }
      
      if (status !== "All") {
        filteredDevices = filteredDevices.filter(d => d.status === status);
      }
      
      return {
        success: true,
        devices: filteredDevices,
        totalCount: filteredDevices.length,
        filters: { clientId, status },
      };
    } catch (error) {
      console.error("Error in device management tool:", error);
      return {
        success: false,
        message: "An error occurred while retrieving device information.",
      };
    }
  },
});
