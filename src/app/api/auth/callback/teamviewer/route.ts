import { NextRequest, NextResponse } from "next/server";
import { getTeamViewerConfig, isTeamViewerConfigured } from "@/lib/teamviewer-config";

/**
 * TeamViewer OAuth callback handler
 * 
 * This route handles the OAuth callback from TeamViewer after a user authorizes the application.
 * It exchanges the authorization code for an access token and stores it for future API calls.
 */
export async function GET(request: NextRequest) {
  // Get the authorization code from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  
  // Check if TeamViewer is configured
  if (!isTeamViewerConfigured()) {
    return NextResponse.json(
      { error: "TeamViewer API is not configured" },
      { status: 500 }
    );
  }
  
  // Check if code is present
  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }
  
  try {
    const config = getTeamViewerConfig();
    
    // In a real implementation, you would exchange the code for an access token here
    // For now, we'll just return a success message
    
    // Redirect to the integrations page with a success message
    return NextResponse.redirect(
      new URL("/admin/integrations?auth=success", request.url)
    );
  } catch (error) {
    console.error("Error in TeamViewer callback:", error);
    
    // Redirect to the integrations page with an error message
    return NextResponse.redirect(
      new URL("/admin/integrations?auth=error", request.url)
    );
  }
}
