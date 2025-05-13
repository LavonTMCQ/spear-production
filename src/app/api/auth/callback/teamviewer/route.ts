import { NextRequest, NextResponse } from "next/server";
import { getTeamViewerConfig, isTeamViewerConfigured } from "@/lib/teamviewer-config";
import { exchangeCodeForToken } from "@/lib/teamviewer-oauth";

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
    // Exchange the authorization code for an access token
    const token = await exchangeCodeForToken(code);

    // In a production environment, you would store the token securely
    // For example, in a database or secure cookie
    console.log("Received TeamViewer token:", {
      access_token: token.access_token.substring(0, 10) + '...',
      expires_in: token.expires_in,
      scope: token.scope,
    });

    // Store token in session or secure cookie (not implemented in this demo)

    // Redirect to the remote control page with a success message
    return NextResponse.redirect(
      new URL("/admin/remote-control?auth=success", request.url)
    );
  } catch (error) {
    console.error("Error in TeamViewer callback:", error);

    // Redirect to the integrations page with an error message
    return NextResponse.redirect(
      new URL("/admin/integrations?auth=error", request.url)
    );
  }
}
