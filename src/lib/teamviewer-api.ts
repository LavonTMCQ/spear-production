/**
 * TeamViewer API Service
 *
 * This file provides functions to interact with the TeamViewer API.
 * It handles authentication, fetching devices, and managing sessions.
 */

/**
 * Format a TeamViewer device ID by removing spaces and any 'r' prefix
 *
 * @param deviceId The device ID to format
 * @returns The formatted device ID
 */
export function formatTeamViewerDeviceId(deviceId: string): string {
  if (!deviceId) return '';

  // Remove spaces
  let formatted = deviceId.replace(/\s+/g, '');

  // Remove 'r' prefix if present (TeamViewer sometimes adds this)
  if (formatted.startsWith('r') && !isNaN(parseInt(formatted.substring(1)))) {
    formatted = formatted.substring(1);
  }

  return formatted;
}

import { getTeamViewerConfig } from './teamviewer-config';

// Define types for TeamViewer API responses
export interface TeamViewerDevice {
  id: string;
  name: string;
  description?: string;
  groupid?: string;
  online_state: 'online' | 'offline' | 'unknown';
  alias?: string;
  last_seen?: string;
  device_info?: {
    model?: string;
    manufacturer?: string;
    os_version?: string;
  };
}

export interface TeamViewerSession {
  id?: string;
  code: string;
  description?: string;
  end_customer?: {
    name?: string;
    email?: string;
  };
  supporter?: {
    name?: string;
    email?: string;
  };
  state: 'Open' | 'Closed' | 'Waiting';
  created: string;
  created_at?: string;
  end?: string;
  valid_until?: string;
  supporter_link?: string;
  end_customer_link?: string;
  webclient_supporter_link?: string;
  groupid?: string;
  online?: boolean;
}

// We're using real API calls now, no mock data needed

/**
 * Get an access token for the TeamViewer API
 *
 * @returns Promise with the access token
 */
export async function getTeamViewerToken(): Promise<string> {
  // Use the script token from configuration
  const { scriptToken } = getTeamViewerConfig();
  console.log('Using TeamViewer script token for authentication');
  return scriptToken;
}

/**
 * Get devices from the TeamViewer API
 *
 * @returns Promise with an array of TeamViewer devices
 */
export async function getTeamViewerDevices(): Promise<TeamViewerDevice[]> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log('Got TeamViewer token, fetching devices...');

    // Make a real API call to get devices
    const response = await fetch('https://webapi.teamviewer.com/api/v1/devices', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('TeamViewer API error:', response.status, response.statusText);
      throw new Error(`TeamViewer API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('TeamViewer devices:', data);

    // Check if we have any devices from the API
    if (data.devices && data.devices.length > 0) {
      return data.devices;
    }

    // If no devices are found in the API, return an empty array
    console.log('No devices found in TeamViewer account');
    return [];
  } catch (error) {
    console.error('Error fetching TeamViewer devices:', error);

    // Rethrow the error to be handled by the caller
    throw error;
  }
}

/**
 * Get a specific device from the TeamViewer API
 *
 * @param deviceId The ID of the device to get
 * @returns Promise with the device information
 */
export async function getTeamViewerDevice(deviceId: string): Promise<TeamViewerDevice | null> {
  try {
    const devices = await getTeamViewerDevices();
    return devices.find(device => device.id === deviceId) || null;
  } catch (error) {
    console.error(`Error fetching TeamViewer device ${deviceId}:`, error);
    throw error;
  }
}

/**
 * Create a session for a device
 *
 * @param deviceId The ID of the device to create a session for
 * @returns Promise with the session information
 */
export async function createTeamViewerSession(deviceId: string): Promise<TeamViewerSession> {
  try {
    // Log the device ID we're creating a session for
    console.log(`Creating TeamViewer session for device ${deviceId}...`);

    // For real devices, make a real API call
    const token = await getTeamViewerToken();

    // Use the main sessions API endpoint as discovered in our testing
    const response = await fetch(`https://webapi.teamviewer.com/api/v1/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupname: 'Spear Remote Control',
        description: 'Remote control session from Spear',
        end_customer: {
          name: 'Spear User',
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to create TeamViewer session: ${response.status}`;

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

    // Return the full session data with all the links and properties
    return {
      id: data.id,
      code: data.code,
      state: data.state || 'Open',
      created: data.created_at || new Date().toISOString(),
      valid_until: data.valid_until,
      supporter_link: data.supporter_link,
      end_customer_link: data.end_customer_link,
      webclient_supporter_link: data.webclient_supporter_link
    };
  } catch (error) {
    console.error(`Error creating TeamViewer session for device ${deviceId}:`, error);

    // Rethrow the error to be handled by the caller
    throw error;
  }
}

/**
 * End a session
 *
 * @param sessionId The ID of the session to end
 * @returns Promise with the updated session information
 */
export async function endTeamViewerSession(sessionId: string): Promise<TeamViewerSession> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log(`Ending TeamViewer session ${sessionId}...`);

    // Use PUT method to update the session state to "Closed" as discovered in our testing
    const response = await fetch(`https://webapi.teamviewer.com/api/v1/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state: 'Closed'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to end TeamViewer session: ${response.status}`;

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

    // Get the updated session details
    const getResponse = await fetch(`https://webapi.teamviewer.com/api/v1/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (getResponse.ok) {
      const sessionData = await getResponse.json();
      console.log('TeamViewer session closed:', sessionData);
      return {
        id: sessionId,
        code: sessionData.code || '',
        state: 'Closed',
        created: sessionData.created_at || new Date(Date.now() - 3600000).toISOString(),
        end: new Date().toISOString(),
        valid_until: sessionData.valid_until
      };
    }

    // Fallback if we can't get the updated session details
    return {
      id: sessionId,
      code: '',
      state: 'Closed',
      created: new Date(Date.now() - 3600000).toISOString(),
      end: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error ending TeamViewer session ${sessionId}:`, error);
    throw error;
  }
}
