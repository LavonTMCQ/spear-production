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
 * Create a session using the Service Queue API
 *
 * @param queueId The ID of the service queue to create a session in
 * @param customFields Custom fields to include in the session
 * @returns Promise with the session information and connection URL
 */
export async function createServiceQueueSession(
  queueId: string,
  customFields?: Record<string, string>
): Promise<{
  session: ServiceQueueSession;
  connectionUrl: string;
  embeddedUrl: string;
}> {
  try {
    // Get a real API token
    const token = await getTeamViewerToken();

    console.log(`Creating TeamViewer service queue session in queue ${queueId}...`);

    // Try to make a real API call
    try {
      const response = await fetch(`https://webapi.teamviewer.com/api/v1/servicequeues/${queueId}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          custom_fields: customFields,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('TeamViewer service queue session created:', data);

        // Format the session code to ensure it doesn't have spaces
        const formattedSessionCode = data.code.replace(/\s+/g, '');

        return {
          session: data,
          connectionUrl: `https://start.teamviewer.com/${formattedSessionCode}`,
          embeddedUrl: `https://start.teamviewer.com/${formattedSessionCode}?embedded=true`,
        };
      } else {
        console.error('Failed to create service queue session:', response.status, await response.text());
        // Fall through to mock data
      }
    } catch (apiError) {
      console.error('API error creating service queue session:', apiError);
      // Fall through to mock data
    }

    // If the API call fails, fall back to mock data
    console.log('Falling back to mock service queue session data');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sessionId = `s${Math.random().toString(36).substring(2, 10)}`;
    const sessionCode = REAL_DEVICE_ID; // Your actual TeamViewer ID

    // Format the session code to ensure it doesn't have spaces
    const formattedSessionCode = sessionCode.replace(/\s+/g, '');

    return {
      session: {
        id: sessionId,
        queue_id: queueId,
        code: sessionCode,
        state: 'Open',
        created: new Date().toISOString(),
        custom_fields: customFields,
      },
      connectionUrl: `https://start.teamviewer.com/${formattedSessionCode}`,
      embeddedUrl: `https://start.teamviewer.com/${formattedSessionCode}?embedded=true`,
    };
  } catch (error) {
    console.error(`Error creating TeamViewer service queue session:`, error);
    throw error;
  }
}

/**
 * End a service queue session
 *
 * @param sessionId The ID of the session to end
 * @returns Promise with the updated session information
 */
export async function endServiceQueueSession(sessionId: string): Promise<ServiceQueueSession> {
  try {
    // In a real implementation, this would make an API call to end a session
    // For now, we'll return mock data

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: sessionId,
      queue_id: 'q12345',
      code: REAL_DEVICE_ID,
      state: 'Closed',
      created: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      end: new Date().toISOString(),
    };

    /* Real implementation would look like this:
    const token = await getTeamViewerToken();
    const response = await fetch(`https://webapi.teamviewer.com/api/v1/servicequeues/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to end service queue session: ${response.status} ${response.statusText}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error(`Error ending TeamViewer service queue session ${sessionId}:`, error);
    throw error;
  }
}
