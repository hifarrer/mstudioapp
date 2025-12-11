"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";

export default function AudioIsolation() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultAudioUrl(null);

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/audio-isolation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // The response might be a blob (audio file) or JSON with a URL
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // If the response contains a URL or file path
        if (data.url || data.audio_url || data.output) {
          setResultAudioUrl(data.url || data.audio_url || data.output);
        } else {
          // If it's a base64 encoded audio
          if (data.audio) {
            setResultAudioUrl(data.audio);
          } else {
            throw new Error("Unexpected response format from API");
          }
        }
      } else {
        // Response is likely an audio file blob
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setResultAudioUrl(audioUrl);
      }
    } catch (err) {
      console.error("Audio isolation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Audio Isolation</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        Remove background noise from your audio file
      </p>

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Processing..." : "Remove Background Noise"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Original Audio Player */}
        {fileUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Original Audio</h3>
            <AudioPlayer audioUrl={fileUrl} />
          </div>
        )}

        {/* Result Audio Player */}
        {resultAudioUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-400">Isolated Audio (Background Removed)</h3>
            <AudioPlayer audioUrl={resultAudioUrl} />
          </div>
        )}
      </form>
    </div>
  );
}




