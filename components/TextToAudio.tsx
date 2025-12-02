"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { submitTextToAudio, pollResult, type TextToAudioRequest } from "@/lib/wavespeed-api";
import AudioPlayer from "./AudioPlayer";

export default function TextToAudio() {
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [bitrate, setBitrate] = useState(256000);
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(
    async (id: string) => {
      const apiKey = process.env.NEXT_PUBLIC_WAVESPEED_API_KEY || "";
      if (!apiKey) {
        setError("API key not configured");
        return;
      }

      setIsPolling(true);
      pollingIntervalRef.current = setInterval(async () => {
        try {
          if (!id) {
            console.error("Polling called with undefined ID");
            setIsPolling(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            setError("Invalid request ID");
            setIsLoading(false);
            return;
          }
          
          const result = await pollResult(id, apiKey);
          console.log("Poll result:", result);
          
          // The result might be wrapped in a 'data' object
          const resultAny = result as any;
          const resultData = resultAny?.data || resultAny;
          
          const status = resultData?.status || resultAny?.status;
          const outputs = resultData?.outputs || resultAny?.outputs;
          const output = resultData?.output || resultAny?.output;
          const error = resultData?.error || resultAny?.error;
          
          // Check for completed status with outputs array
          if ((status === "succeeded" || status === "completed") && 
              (output || (outputs && outputs.length > 0))) {
            setIsPolling(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            // Extract audio URL from outputs array or output string
            const audioUrl = outputs && outputs.length > 0 
              ? outputs[0] 
              : output;
            if (audioUrl) {
              setAudioUrl(audioUrl);
            }
            setIsLoading(false);
          } else if (status === "failed") {
            setIsPolling(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            setError(error || "Generation failed");
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAudioUrl(null);

    const apiKey = process.env.NEXT_PUBLIC_WAVESPEED_API_KEY || "";
    if (!apiKey) {
      setError("API key not configured. Please set NEXT_PUBLIC_WAVESPEED_API_KEY in .env.local");
      return;
    }

    setIsLoading(true);

    try {
      const requestData: TextToAudioRequest = {
        prompt: prompt,
        lyrics: lyrics,
        bitrate: bitrate,
        sample_rate: 44100,
      };

      const response = await submitTextToAudio(requestData, apiKey);
      console.log("Submit response:", response);
      
      // Extract ID from response - handle the response as any to access all fields
      const responseAny = response as any;
      
      // The response might be wrapped in a 'data' object
      const data = responseAny?.data || responseAny;
      let requestId: string | undefined = data?.id;
      
      // If ID not found, try to extract from URLs.get if present
      if (!requestId && data?.urls?.get) {
        const urlMatch = data.urls.get.match(/\/predictions\/([^\/]+)\//);
        if (urlMatch && urlMatch[1]) {
          requestId = urlMatch[1];
        }
      }
      
      // Try alternative field names
      if (!requestId) {
        requestId = data?.prediction_id || data?.request_id || responseAny?.prediction_id || responseAny?.request_id;
      }
      
      if (!requestId) {
        console.error("No request ID found. Full response:", JSON.stringify(response, null, 2));
        setError("Failed to get request ID from API response. Check console for details.");
        setIsLoading(false);
        return;
      }
      
      console.log("Using request ID:", requestId);
      setRequestId(requestId);
      await startPolling(requestId);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Text to Audio</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="A melancholic indie dream-pop song sung by a soft male voice, light guitars and distant reverb. Emotional and reflective."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Lyrics */}
        <div>
          <label className="block text-sm font-medium mb-2">Lyrics</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={8}
            placeholder="(Verse 1)&#10;The ocean hums a quiet tune,&#10;..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Bitrate */}
        <div>
          <label className="block text-sm font-medium mb-2">Bitrate</label>
          <input
            type="number"
            value={bitrate}
            onChange={(e) => setBitrate(Number(e.target.value))}
            min={64000}
            max={320000}
            step={32000}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Default: 256000</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt || !lyrics}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Generating..." : "Generate Audio"}
        </button>

        {/* Loading State */}
        {isLoading && requestId && (
          <div className="text-center text-sm text-gray-400">
            <p>Request ID: {requestId}</p>
            <p className="mt-2">Polling for results...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </form>
    </div>
  );
}

