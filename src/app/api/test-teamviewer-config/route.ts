import { NextResponse } from "next/server";
import { teamViewerConfig } from "@/lib/teamviewer-config";

export async function GET() {
  return NextResponse.json({
    isConfigured: teamViewerConfig.isConfigured(),
    // Don't expose the full client secret in production
    clientId: teamViewerConfig.clientId,
    redirectUri: teamViewerConfig.redirectUri,
    clientSecretConfigured: Boolean(teamViewerConfig.clientSecret),
  });
}
