import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set ELEVENLABS_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // Create a new FormData to forward to ElevenLabs
    const elevenLabsFormData = new FormData();

    // Add file if present
    const file = formData.get("file") as File | null;
    if (file) {
      elevenLabsFormData.append("file", file);
    }

    // Add optional files
    const csvFile = formData.get("csv_file") as File | null;
    if (csvFile) {
      elevenLabsFormData.append("csv_file", csvFile);
    }

    const foregroundAudioFile = formData.get("foreground_audio_file") as File | null;
    if (foregroundAudioFile) {
      elevenLabsFormData.append("foreground_audio_file", foregroundAudioFile);
    }

    const backgroundAudioFile = formData.get("background_audio_file") as File | null;
    if (backgroundAudioFile) {
      elevenLabsFormData.append("background_audio_file", backgroundAudioFile);
    }

    // Add target language
    const targetLang = formData.get("target_lang") as string;
    if (targetLang) {
      elevenLabsFormData.append("target_lang", targetLang);
    }

    const response = await fetch(`${ELEVENLABS_API_BASE}/dubbing`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return NextResponse.json(
        { error: `ElevenLabs API Error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dubbing creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

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

    if (!dubbingId) {
      return NextResponse.json(
        { error: "dubbing_id parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${ELEVENLABS_API_BASE}/dubbing/${dubbingId}`, {
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dubbing status check error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// Handle download requests - this will be a separate route file
// We'll create app/api/dubbing/download/route.ts instead

