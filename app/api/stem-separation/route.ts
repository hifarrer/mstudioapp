import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set ELEVENLABS_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Create FormData for Elevenlabs API
    const elevenlabsFormData = new FormData();
    elevenlabsFormData.append("file", file);

    // Call Elevenlabs API
    const response = await fetch("https://api.elevenlabs.io/v1/music/stem-separation", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenlabsFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Elevenlabs API Error: ${errorText}` },
        { status: response.status }
      );
    }

    // Get the zip file as a blob
    const zipBlob = await response.blob();

    // Return the zip file
    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="stems.zip"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}




