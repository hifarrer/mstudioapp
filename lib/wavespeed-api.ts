const WAVESPEED_API_BASE = "https://api.wavespeed.ai/api/v3";

export interface AudioToAudioRequest {
  audio: string;
  edit_mode: "remix" | "lyrics";
  lyrics: string;
  original_lyrics: string;
  original_tags: string;
  seed?: number;
  tags: string;
}

export interface TextToAudioRequest {
  bitrate: number;
  lyrics: string;
  prompt: string;
  sample_rate?: number;
}

export interface AudioInpaintRequest {
  audio: string;
  end_time: number;
  end_time_relative_to: "start" | "end";
  lyrics: string;
  seed?: number;
  start_time: number;
  start_time_relative_to: "start" | "end";
  tags: string;
}

export interface PredictionResponse {
  id?: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "completed" | "created";
  output?: string;
  outputs?: string[];
  error?: string;
  urls?: {
    get: string;
  };
  model?: string;
  timings?: {
    inference: number;
  };
  created_at?: string;
  has_nsfw_contents?: any[];
}

export async function submitAudioToAudio(
  data: AudioToAudioRequest,
  apiKey: string
): Promise<PredictionResponse> {
  const response = await fetch(`${WAVESPEED_API_BASE}/wavespeed-ai/ace-step/audio-to-audio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return response.json();
}

export async function submitTextToAudio(
  data: TextToAudioRequest,
  apiKey: string
): Promise<PredictionResponse> {
  const response = await fetch(`${WAVESPEED_API_BASE}/minimax/music-02`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return response.json();
}

export async function submitAudioInpaint(
  data: AudioInpaintRequest,
  apiKey: string
): Promise<PredictionResponse> {
  const response = await fetch(`${WAVESPEED_API_BASE}/wavespeed-ai/ace-step/audio-inpaint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return response.json();
}

export async function pollResult(
  requestId: string,
  apiKey: string
): Promise<PredictionResponse> {
  const response = await fetch(`${WAVESPEED_API_BASE}/predictions/${requestId}/result`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${error}`);
  }

  return response.json();
}

