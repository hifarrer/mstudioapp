"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { submitAudioToAudio, pollResult, type AudioToAudioRequest } from "@/lib/wavespeed-api";
import AudioPlayer from "./AudioPlayer";

export default function AudioToAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [originalTags, setOriginalTags] = useState("");
  const [tags, setTags] = useState("");
  const [editMode, setEditMode] = useState<"remix" | "lyrics">("remix");
  const [originalLyrics, setOriginalLyrics] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith("audio/")) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const uploadFileToStorage = async (file: File): Promise<string> => {
    // For MVP, we'll use a data URL or upload to a temporary storage
    // In production, you'd upload to your own storage and return the URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // For now, return a placeholder - in production, upload to storage
        // and return the public URL
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

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
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAudioUrl(null);

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_WAVESPEED_API_KEY || "";
    if (!apiKey) {
      setError("API key not configured. Please set NEXT_PUBLIC_WAVESPEED_API_KEY in .env.local");
      return;
    }

    setIsLoading(true);

    try {
      // Upload file and get URL
      // Note: For production, you should upload the file to your own storage (S3, etc.)
      // and provide the public URL. The API expects a publicly accessible URL.
      const audioUrl = await uploadFileToStorage(file);

      const requestData: AudioToAudioRequest = {
        audio: audioUrl,
        edit_mode: editMode,
        lyrics: lyrics,
        original_lyrics: originalLyrics,
        original_tags: originalTags,
        tags: tags,
        seed: -1,
      };

      const response = await submitAudioToAudio(requestData, apiKey);
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
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Audio to Audio</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Audio File</label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {file ? (
              <div>
                <p className="text-green-400">✓ {file.name}</p>
                <p className="text-sm text-gray-400 mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-2">Drag & drop audio file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Original Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Original Tags</label>
          <input
            type="text"
            value={originalTags}
            onChange={(e) => setOriginalTags(e.target.value)}
            placeholder="lofi, hiphop, drum and bass, trap, chill"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="lofi, hiphop, drum and bass, trap, chill"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Edit Mode */}
        <div>
          <label className="block text-sm font-medium mb-2">Edit Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="remix"
                checked={editMode === "remix"}
                onChange={(e) => setEditMode(e.target.value as "remix" | "lyrics")}
                className="mr-2"
              />
              Remix
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="lyrics"
                checked={editMode === "lyrics"}
                onChange={(e) => setEditMode(e.target.value as "remix" | "lyrics")}
                className="mr-2"
              />
              Lyrics
            </label>
          </div>
        </div>

        {/* Original Lyrics */}
        <div>
          <label className="block text-sm font-medium mb-2">Original Lyrics</label>
          <textarea
            value={originalLyrics}
            onChange={(e) => setOriginalLyrics(e.target.value)}
            rows={4}
            placeholder="Enter original lyrics..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Lyrics */}
        <div>
          <label className="block text-sm font-medium mb-2">Lyrics (New)</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={4}
            placeholder="Enter new lyrics..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Processing..." : "Generate Audio"}
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

