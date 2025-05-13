import { NextResponse } from "next/server";
import { getTeamViewerConfig, isTeamViewerConfigured } from "@/lib/teamviewer-config";

/**
 * API route to check TeamViewer configuration status
 * 
 * @returns JSON response with configuration status
 */
export async function GET() {
  const config = getTeamViewerConfig();
  const isConfigured = isTeamViewerConfigured();
  
  return NextResponse.json({
    isConfigured,
    clientId: config.clientId ? config.clientId.substring(0, 8) + '...' : null,
    clientSecretConfigured: Boolean(config.clientSecret),
    redirectUri: config.redirectUri,
    // Include raw environment variables for debugging
    envVars: {
      TEAMVIEWER_CLIENT_ID: process.env.TEAMVIEWER_CLIENT_ID ? 'set' : 'not set',
      TEAMVIEWER_CLIENT_SECRET: process.env.TEAMVIEWER_CLIENT_SECRET ? 'set' : 'not set',
      TEAMVIEWER_REDIRECT_URI: process.env.TEAMVIEWER_REDIRECT_URI ? 'set' : 'not set',
    }
  });
}
