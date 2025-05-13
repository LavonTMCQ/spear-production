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
  supportsUnattended?: boolean;
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
  webClientUrl?: string;
  endCustomerUrl?: string;
  sessionId?: string;
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

    // Log the raw device data for debugging
    if (data.devices && data.devices.length > 0) {
      console.log('Raw device data from TeamViewer API:');
      data.devices.forEach((device: any, index: number) => {
        console.log(`Device ${index + 1}:`, JSON.stringify(device, null, 2));
      });
    }

    // Process all devices, not just those with unattended access
    if (data.devices && data.devices.length > 0) {
      // Map the API response to our interface
      const mappedDevices = data.devices.map((device: any) => {
        // For your specific Android device, force supportsUnattended to true
        // This is a workaround for devices that support unattended access but don't report it correctly
        const isYourAndroidDevice =
          (device.remotecontrol_id === '579487224' ||
           device.device_id === 'd1645844505' ||
           device.id === 'd1645844505');

        return {
          id: device.device_id || device.id,
          deviceId: device.remotecontrol_id || device.device_id || device.id,
          name: device.alias || device.name || device.device_id || device.id,
          description: device.description,
          groupId: device.groupid,
          online: device.online_state === 'online',
          lastSeen: device.last_seen,
          alias: device.alias,
          // Force supportsUnattended to true for your Android device
          supportsUnattended: isYourAndroidDevice ? true : (device.policy?.unattended_access === true),
          deviceInfo: {
            model: device.device_info?.model,
            manufacturer: device.device_info?.manufacturer,
            osVersion: device.device_info?.os_version
          }
        };
      });

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

    console.log(`Connecting to device ${deviceId}...`);

    // Get the device details
    const devices = await getUnattendedDevices();
    const device = devices.find(d => d.id === deviceId);

    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }

    console.log('Found device:', device);

    // Format the device ID - use the remotecontrol_id directly
    // This is the ID that appears in the TeamViewer client (9-digit number)
    const formattedDeviceId = formatTeamViewerDeviceId(device.deviceId);
    console.log('Formatted device ID for connection:', formattedDeviceId);

    // Check if this is your Android device that supports unattended access
    const isYourAndroidDevice =
      (device.deviceId === 'r579487224' ||
       device.deviceId === '579487224' ||
       device.id === 'd1645844505');

    if (isYourAndroidDevice || device.supportsUnattended) {
      console.log('Device supports unattended access, using direct connection...');

      // For unattended access, we connect directly to the device using its ID
      // This is the key difference - we don't create a session, we connect directly
      const formattedRemoteId = formatTeamViewerDeviceId(device.deviceId);

      console.log(`Using unattended access for device ${device.name} with ID: ${formattedRemoteId}`);

      // For unattended access, we need to use the correct URL format for Host mode
      // This is the key to making unattended access work properly

      // Get device information for the URL
      const deviceName = device.name || 'Android Device';
      const deviceType = 'Mobile';

      // Create the proper web client URL for unattended access (Host mode)
      const webClientUrl = `https://web.teamviewer.com/Connect?uiMode=OneUI&lng=en&TabMode=MultiTabUI&machineId=${formattedRemoteId}&deviceName=${encodeURIComponent(deviceName)}&deviceType=${deviceType}&connectByKnownDeviceMode=RemoteControl`;

      // Create the proper direct connection URL for unattended access (Host mode)
      const connectionUrl = `teamviewer10://control?s=${formattedRemoteId}&deviceName=${encodeURIComponent(deviceName)}&deviceType=${deviceType}&connectByKnownDeviceMode=RemoteControl`;

      console.log(`Created unattended access URLs for device ${deviceName}:`);
      console.log(`- Web client URL: ${webClientUrl}`);
      console.log(`- Direct connection URL: ${connectionUrl}`);

      return {
        deviceId: formattedRemoteId,
        password: '', // No password needed for unattended access
        connectionUrl: connectionUrl,
        webClientUrl: webClientUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours by default
      };
    }

    // For devices that don't support unattended access, create a session
    console.log('Device does not support unattended access, creating session...');

    try {
      // Use the main sessions API endpoint
      const endpoint = 'https://webapi.teamviewer.com/api/v1/sessions';
      const requestBody = {
        groupname: 'Spear Remote Control',
        description: `Remote access to ${device.name || device.id}`,
        end_customer: {
          name: 'Spear User',
        }
      };

      console.log(`Creating session for device ${deviceId} (${device.deviceId})...`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to create session: ${response.status}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = `${errorMessage} - ${errorData.error_description || errorData.error}`;
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = `${errorMessage} - ${errorText}`;
        }

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('TeamViewer session created:', data);

      // Extract all the useful information from the session response
      const sessionId = data.code;
      const formattedSessionId = formatTeamViewerDeviceId(sessionId);

      console.log(`Session created with ID: ${sessionId}`);

      // Return a comprehensive result with all available connection options
      return {
        deviceId: formattedSessionId,
        password: data.password || '',
        connectionUrl: data.supporter_link || `https://start.teamviewer.com/${formattedSessionId}`,
        webClientUrl: data.webclient_supporter_link,
        endCustomerUrl: data.end_customer_link,
        sessionId: sessionId,
        expiresAt: data.valid_until || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours by default
      };
    } catch (error) {
      console.error(`Error creating session for device ${deviceId}:`, error);

      // If session creation fails, fall back to direct connection
      console.log('Falling back to direct connection for device:', formattedDeviceId);

      // For direct connection, we don't need a password
      return {
        deviceId: formattedDeviceId,
        password: '',
        connectionUrl: `https://start.teamviewer.com/${formattedDeviceId}`,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes for direct connection
      };
    }
  } catch (error) {
    console.error(`Error connecting to TeamViewer device ${deviceId}:`, error);
    throw error;
  }
}
