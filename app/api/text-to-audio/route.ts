import { NextRequest, NextResponse } from "next/server";
import { submitTextToAudio } from "@/lib/wavespeed-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.WAVESPEED_API_KEY || process.env.NEXT_PUBLIC_WAVESPEED_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const result = await submitTextToAudio(body, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}




