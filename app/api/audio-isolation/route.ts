import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured. Please set ELEVENLABS_API_KEY or NEXT_PUBLIC_ELEVENLABS_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Create a new FormData to forward to ElevenLabs
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("audio", audioFile);

    // Forward the request to ElevenLabs API
    const response = await fetch("https://api.elevenlabs.io/v1/audio-isolation", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` };
      }
      return NextResponse.json(
        { error: errorData.error || errorData.message || "ElevenLabs API error" },
        { status: response.status }
      );
    }

    // Check if the response is an audio file (binary) or JSON
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      // If it's JSON, return it as JSON
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      // If it's an audio file, return it as a blob
      const audioBlob = await response.blob();
      return new NextResponse(audioBlob, {
        headers: {
          "Content-Type": contentType || "audio/mpeg",
        },
      });
    }
  } catch (error) {
    console.error("Audio isolation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

