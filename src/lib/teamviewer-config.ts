/**
 * TeamViewer API configuration
 *
 * This file provides access to TeamViewer API credentials from environment variables.
 * In development, these values come from your .env.local file.
 * In production, they should be set in your hosting environment.
 */

// For development purposes, we're hardcoding the values
// In production, these would come from environment variables
const DEV_CLIENT_ID = '748865-SKNA4jUQk10HvZIZhVoD';
const DEV_CLIENT_SECRET = 'XhWKLqAlNJM3YVkEPiFA';
const DEV_REDIRECT_URI = 'http://localhost:3000/api/auth/callback/teamviewer';
const SCRIPT_TOKEN = '26405094-jajtBr0ScJN8z3e83zsY';

// Android device information
const ANDROID_DEVICE_ID = 'd1645844505';
const ANDROID_REMOTE_ID = '579487224';

export const teamViewerConfig = {
  clientId: process.env.NEXT_PUBLIC_TEAMVIEWER_CLIENT_ID || process.env.TEAMVIEWER_CLIENT_ID || DEV_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_TEAMVIEWER_CLIENT_SECRET || process.env.TEAMVIEWER_CLIENT_SECRET || DEV_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_TEAMVIEWER_REDIRECT_URI || process.env.TEAMVIEWER_REDIRECT_URI || DEV_REDIRECT_URI,
  scriptToken: process.env.TEAMVIEWER_SCRIPT_TOKEN || SCRIPT_TOKEN,

  // Android device configuration
  androidDeviceId: ANDROID_DEVICE_ID,
  androidRemoteId: ANDROID_REMOTE_ID,

  isConfigured: () => {
    // For development, always return true
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // For production, check if the environment variables are set
    return Boolean(
      (process.env.NEXT_PUBLIC_TEAMVIEWER_CLIENT_ID || process.env.TEAMVIEWER_CLIENT_ID) &&
      (process.env.NEXT_PUBLIC_TEAMVIEWER_CLIENT_SECRET || process.env.TEAMVIEWER_CLIENT_SECRET) &&
      (process.env.NEXT_PUBLIC_TEAMVIEWER_REDIRECT_URI || process.env.TEAMVIEWER_REDIRECT_URI)
    );
  }
};

/**
 * Get the TeamViewer configuration
 *
 * @returns The TeamViewer configuration
 */
export function getTeamViewerConfig() {
  return teamViewerConfig;
}

/**
 * Get the TeamViewer API configuration
 *
 * @returns TeamViewer API configuration object
 */
export function getTeamViewerConfig() {
  return teamViewerConfig;
}

/**
 * Check if TeamViewer API is configured
 *
 * @returns boolean indicating if all required TeamViewer API credentials are set
 */
export function isTeamViewerConfigured() {
  return teamViewerConfig.isConfigured();
}
