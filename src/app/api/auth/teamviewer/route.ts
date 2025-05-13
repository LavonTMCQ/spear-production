import { NextRequest, NextResponse } from "next/server";
import { getTeamViewerAuthUrl } from "@/lib/teamviewer-oauth";
import { isTeamViewerConfigured } from "@/lib/teamviewer-config";

/**
 * TeamViewer OAuth initialization
 * 
 * This route generates the TeamViewer OAuth URL and redirects the user to it.
 * After authorization, TeamViewer will redirect back to the callback URL.
 */
export async function GET(request: NextRequest) {
  // Check if TeamViewer is configured
  if (!isTeamViewerConfigured()) {
    return NextResponse.json(
      { error: "TeamViewer API is not configured" },
      { status: 500 }
    );
  }
  
  try {
    // Generate the TeamViewer OAuth URL
    const authUrl = getTeamViewerAuthUrl();
    
    // Redirect to the TeamViewer OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating TeamViewer auth URL:", error);
    
    // Return error response
    return NextResponse.json(
      { error: "Failed to generate TeamViewer auth URL" },
      { status: 500 }
    );
  }
}
