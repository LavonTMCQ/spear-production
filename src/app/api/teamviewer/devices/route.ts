import { NextRequest, NextResponse } from "next/server";
import { getTeamViewerDevices } from "@/lib/teamviewer-api";
import { isTeamViewerConfigured } from "@/lib/teamviewer-config";

/**
 * API route to get TeamViewer devices
 * 
 * @returns JSON response with devices or error
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
    // Get devices from TeamViewer API
    const devices = await getTeamViewerDevices();
    
    return NextResponse.json({ devices });
  } catch (error) {
    console.error("Error fetching TeamViewer devices:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch TeamViewer devices" },
      { status: 500 }
    );
  }
}
