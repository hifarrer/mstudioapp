import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Music Gen API is working. Use POST to generate music." });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set ELEVENLABS_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const { prompt, music_length_ms, force_instrumental, output_format } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Prepare request body for ElevenLabs API
    const requestBody: Record<string, unknown> = {
      prompt: prompt,
    };

    if (music_length_ms !== undefined) {
      requestBody.music_length_ms = music_length_ms;
    }

    if (force_instrumental !== undefined) {
      requestBody.force_instrumental = force_instrumental;
    }

    if (output_format) {
      requestBody.output_format = output_format;
    }

    // Call ElevenLabs API
    const response = await fetch("https://api.elevenlabs.io/v1/music/compose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Elevenlabs API Error: ${errorText}` },
        { status: response.status }
      );
    }

    // Get the audio file as a blob
    const audioBlob = await response.blob();

    // Return the audio file
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": audioBlob.type || "audio/mpeg",
        "Content-Disposition": `attachment; filename="music.mp3"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

