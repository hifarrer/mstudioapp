"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";

export default function SoundEffects() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAudioUrl(null);

    if (!text.trim()) {
      setError("Please enter a description for the sound effect");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/sound-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.audio) {
        setAudioUrl(data.audio);
      } else {
        throw new Error("No audio data received from API");
      }
    } catch (err) {
      console.error("Sound generation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Sound Effects</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        Generate sound effects from text descriptions using AI
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Sound Description</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Spacious braam suitable for high-impact movie trailer moments"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Describe the sound effect you want to generate
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Generating Sound..." : "Generate Sound Effect"}
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-sm text-gray-400">
            <p>Generating sound effect...</p>
            <p className="mt-2 text-xs">This may take a few moments</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <p className="text-green-400 mb-3">✓ Sound effect generated!</p>
            <AudioPlayer audioUrl={audioUrl} />
          </div>
        )}
      </form>
    </div>
  );
}




