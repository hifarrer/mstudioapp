import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set ELEVENLABS_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const dubbingId = searchParams.get("id");
    const languageCode = searchParams.get("lang") || "es"; // Default to Spanish if not provided

    if (!dubbingId) {
      return NextResponse.json(
        { error: "dubbing_id parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${ELEVENLABS_API_BASE}/dubbing/${dubbingId}/audio/${languageCode}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return NextResponse.json(
        { error: `ElevenLabs API Error: ${errorText}` },
        { status: response.status }
      );
    }

    // Get the audio file as a blob
    const audioBlob = await response.blob();
    const contentType = response.headers.get("content-type") || "audio/mpeg";

    // Return the audio file with appropriate headers
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="dubbed_audio_${dubbingId}_${languageCode}.mp3"`,
      },
    });
  } catch (error) {
    console.error("Dubbing download error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}




