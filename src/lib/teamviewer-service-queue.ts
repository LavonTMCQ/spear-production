/**
 * TeamViewer Service Queue API
 *
 * This file provides functions to interact with the TeamViewer Service Queue API.
 * It allows creating and managing service queue sessions, which can be embedded
 * in web applications.
 *
 * TeamViewer API Documentation: https://integrate.teamviewer.com/en/develop/api/
 */

import { getTeamViewerConfig } from './teamviewer-config';
import { getTeamViewerToken } from './teamviewer-api';

// Define types for TeamViewer Service Queue API responses
export interface ServiceQueueEntry {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  custom_fields?: Record<string, string>;
}

export interface ServiceQueueSession {
  id: string;
  queue_id: string;
  code: string;
  state: 'Open' | 'Closed' | 'Waiting';
  created: string;
  end?: string;
  supporter_id?: string;
  custom_fields?: Record<string, string>;
}

// Your real TeamViewer ID
const REAL_DEVICE_ID = '579487224';
// Your real device ID
const REAL_DEVICE_INTERNAL_ID = 'd1645844505';

/**
 * Get service queues from the TeamViewer API
 *
 * @returns Promise with an array of service queues
 */
export async function getServiceQueues(): Promise<ServiceQueueEntry[]> {
  try {
    // In a real implementation, this would make an API call to get service queues
    // For now, we'll return mock data

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: 'q12345',
        name: 'Support Queue',
        description: 'Queue for support requests',
        status: 'active',
      },
      {
        id: 'q67890',
        name: 'Sales Queue',
        description: 'Queue for sales inquiries',
        status: 'active',
      }
    ];

    /* Real implementation would look like this:
    const token = await getTeamViewerToken();
    const response = await fetch('https://webapi.teamviewer.com/api/v1/servicequeues', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get service queues: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.service_queues || [];
    */
  } catch (error) {
    console.error('Error fetching TeamViewer service queues:', error);
    throw error;
  }
}

/**
 * Create a session using the main Sessions API instead of Service Queue API
 *
 * @param queueId The ID of the service queue (not used anymore, kept for compatibility)
 * @param customFields Custom fields to include in the session description
 * @returns Promise with the session information and connection URL
 */
export async function createServiceQueueSession(
  queueId: string,
  customFields?: Record<string, string>
): Promise<{
  session: ServiceQueueSession;
  connectionUrl: string;
  embeddedUrl: string;
  webclientUrl?: string;
}> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log(`Creating TeamViewer session (previously used queue ${queueId})...`);

    // Create a description from custom fields
    let description = 'Remote control session from Spear';
    if (customFields) {
      const deviceInfo = customFields.deviceId ? ` for device ${customFields.deviceId}` : '';
      const requestedBy = customFields.requestedBy ? ` requested by ${customFields.requestedBy}` : '';
      description = `Remote control session${deviceInfo}${requestedBy}`;
    }

    // Use the main sessions API endpoint as discovered in our testing
    const response = await fetch(`https://webapi.teamviewer.com/api/v1/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupname: 'Spear Remote Control',
        description: description,
        end_customer: {
          name: 'Spear User',
        }
      }),
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

    // Convert the main API response to our service queue format for compatibility
    const sessionData: ServiceQueueSession = {
      id: data.code,
      queue_id: queueId || 'main',
      code: data.code,
      state: data.state || 'Open',
      created: data.created_at || new Date().toISOString(),
      custom_fields: customFields,
    };

    // Use the URLs directly from the API response if available
    return {
      session: sessionData,
      connectionUrl: data.supporter_link || `https://start.teamviewer.com/${data.code}`,
      embeddedUrl: `https://start.teamviewer.com/${data.code}?embedded=true`,
      webclientUrl: data.webclient_supporter_link
    };
  } catch (error) {
    console.error(`Error creating TeamViewer service queue session:`, error);
    throw error;
  }
}

/**
 * End a session using the main Sessions API
 *
 * @param sessionId The ID of the session to end
 * @returns Promise with the updated session information
 */
export async function endServiceQueueSession(sessionId: string): Promise<ServiceQueueSession> {
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
      const data = await getResponse.json();
      console.log('TeamViewer session closed:', data);

      // Convert the main API response to our service queue format for compatibility
      return {
        id: sessionId,
        queue_id: data.groupid || 'main',
        code: data.code || sessionId,
        state: 'Closed',
        created: data.created_at || new Date(Date.now() - 3600000).toISOString(),
        end: new Date().toISOString(),
      };
    }

    // Fallback if we can't get the updated session details
    return {
      id: sessionId,
      queue_id: 'main',
      code: sessionId,
      state: 'Closed',
      created: new Date(Date.now() - 3600000).toISOString(),
      end: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error ending TeamViewer service queue session ${sessionId}:`, error);
    throw error;
  }
}
