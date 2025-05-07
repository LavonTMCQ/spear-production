/**
 * TeamViewer API configuration
 * 
 * This file provides access to TeamViewer API credentials from environment variables.
 * In development, these values come from your .env.local file.
 * In production, they should be set in your hosting environment.
 */

export const teamViewerConfig = {
  clientId: process.env.TEAMVIEWER_CLIENT_ID || '',
  clientSecret: process.env.TEAMVIEWER_CLIENT_SECRET || '',
  redirectUri: process.env.TEAMVIEWER_REDIRECT_URI || '',
  isConfigured: () => {
    return Boolean(
      process.env.TEAMVIEWER_CLIENT_ID &&
      process.env.TEAMVIEWER_CLIENT_SECRET &&
      process.env.TEAMVIEWER_REDIRECT_URI
    );
  }
};

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
