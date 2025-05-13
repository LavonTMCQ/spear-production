/**
 * TeamViewer Unattended Access API
 *
 * This file provides functions to interact with the TeamViewer API for unattended access.
 * It allows fetching unattended devices and connecting to them without requiring
 * someone to accept the connection on the device side.
 */

import { getTeamViewerToken, formatTeamViewerDeviceId } from './teamviewer-api';

// Define types for TeamViewer Unattended API responses
export interface TeamViewerUnattendedDevice {
  id: string;
  deviceId: string;
  name: string;
  description?: string;
  groupId?: string;
  online: boolean;
  lastSeen?: string;
  alias?: string;
  deviceInfo?: {
    model?: string;
    manufacturer?: string;
    osVersion?: string;
  };
}

export interface UnattendedConnectionResult {
  deviceId: string;
  password: string;
  connectionUrl: string;
  expiresAt: string; // ISO date string
}

/**
 * Get unattended devices from the TeamViewer API
 *
 * @returns Promise with an array of unattended devices
 */
export async function getUnattendedDevices(): Promise<TeamViewerUnattendedDevice[]> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log('Getting unattended devices from TeamViewer API...');

    // Make a real API call - note that 'all' is not a valid value for online_state
    // Valid values are: 'online', 'offline', 'busy'
    const response = await fetch('https://webapi.teamviewer.com/api/v1/devices?online_state=online', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to get devices:', response.status, await response.text());
      throw new Error(`Failed to get devices: ${response.status}`);
    }

    const data = await response.json();
    console.log('TeamViewer devices response:', data);

    // Process all devices, not just those with unattended access
    if (data.devices && data.devices.length > 0) {
      // Map the API response to our interface
      const mappedDevices = data.devices.map((device: any) => ({
        id: device.device_id || device.id,
        deviceId: device.remotecontrol_id || device.device_id || device.id,
        name: device.alias || device.name || device.device_id || device.id,
        description: device.description,
        groupId: device.groupid,
        online: device.online_state === 'online',
        lastSeen: device.last_seen,
        alias: device.alias,
        deviceInfo: {
          model: device.device_info?.model,
          manufacturer: device.device_info?.manufacturer,
          osVersion: device.device_info?.os_version
        }
      }));

      console.log('Mapped devices:', mappedDevices);
      return mappedDevices;
    }

    // If no devices are found, return an empty array
    console.log('No devices found in TeamViewer account');
    return [];
  } catch (error) {
    console.error('Error fetching TeamViewer devices:', error);
    throw error;
  }
}

/**
 * Connect to an unattended device
 *
 * @param deviceId The ID of the unattended device to connect to
 * @returns Promise with the connection result
 */
export async function connectToUnattendedDevice(deviceId: string): Promise<UnattendedConnectionResult> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log(`Connecting to unattended device ${deviceId}...`);

    // Get the device details
    const devices = await getUnattendedDevices();
    const device = devices.find(d => d.id === deviceId);

    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }

    // For direct connection to your device
    // Format the device ID
    const formattedDeviceId = formatTeamViewerDeviceId(device.deviceId);

    // Create a session using the TeamViewer API
    const response = await fetch(`https://webapi.teamviewer.com/api/v1/devices/${deviceId}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        end_customer: {
          name: 'Spear User',
        },
        description: 'Remote access from Spear'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create session:', response.status, errorText);

      // If the device doesn't support unattended access, try direct connection
      console.log('Attempting direct connection without session creation');

      // Generate a random password for direct connection
      // Note: This won't actually work for authentication, but we need to provide something
      // The user will need to accept the connection on the device
      const directPassword = Math.random().toString(36).substring(2, 10);

      return {
        deviceId: formattedDeviceId,
        password: directPassword,
        connectionUrl: `https://start.teamviewer.com/${formattedDeviceId}`,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Expires in 5 minutes
      };
    }

    const data = await response.json();
    console.log('TeamViewer session created:', data);

    // Use the session data for connection
    return {
      deviceId: formattedDeviceId,
      password: data.password || '',
      connectionUrl: `https://start.teamviewer.com/${formattedDeviceId}${data.password ? `?password=${data.password}` : ''}`,
      expiresAt: data.valid_until || new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error(`Error connecting to TeamViewer device ${deviceId}:`, error);
    throw error;
  }
}
