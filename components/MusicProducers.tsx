"use client";

import { useState, useEffect, useRef } from "react";
import AudioPlayer from "./AudioPlayer";

export default function MusicProducers() {
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [musicLengthMs, setMusicLengthMs] = useState(30000);
  const [forceInstrumental, setForceInstrumental] = useState(false);
  const [outputFormat, setOutputFormat] = useState("mp3_44100_128");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Additional parameters for Music Producers
  const [bpm, setBpm] = useState<number | "">("");
  const [key, setKey] = useState("");
  const [mood, setMood] = useState("");
  const [instrumentRole, setInstrumentRole] = useState("");

  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyTypes = ["Major", "Minor"];
  const moods = [
    "Happy", "Sad", "Energetic", "Calm", "Aggressive", "Peaceful",
    "Melancholic", "Uplifting", "Dark", "Bright", "Romantic", "Intense"
  ];
  const instrumentRoles = ["Lead", "Support", "Rhythm"];

  // Simulated progress bar
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 90%
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 1;
          if (prev < 85) return prev + 0.5;
          if (prev < 95) return prev + 0.2;
          return prev;
        });
      }, 200);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (progress > 0 && progress < 100) {
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isLoading]);

  const buildEnhancedPrompt = (basePrompt: string): string => {
    let enhancedPrompt = basePrompt;
    const additions: string[] = [];

    if (bpm && typeof bpm === "number" && bpm > 0) {
      additions.push(`${bpm} BPM`);
    }

    if (key) {
      additions.push(`Key: ${key}`);
    }

    if (mood) {
      additions.push(`Mood: ${mood}`);
    }

    if (instrumentRole) {
      additions.push(`Instrument role: ${instrumentRole}`);
    }

    if (additions.length > 0) {
      enhancedPrompt += `\n\n${additions.join(", ")}`;
    }

    return enhancedPrompt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAudioUrl(null);
    setIsLoading(true);

    try {
      const basePrompt = lyrics ? `${prompt}\n\n${lyrics}` : prompt;
      const enhancedPrompt = buildEnhancedPrompt(basePrompt);

      const response = await fetch("/api/music-gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          music_length_ms: musicLengthMs,
          force_instrumental: forceInstrumental,
          output_format: outputFormat,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate music";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("Error generating music:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Professional Music Production</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="A pop song with a catchy chorus and upbeat melody..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
            maxLength={4100}
          />
          <p className="text-xs text-gray-400 mt-1">
            {prompt.length}/4,100 characters
          </p>
        </div>

        {/* Lyrics */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Lyrics <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={10}
            placeholder={`[Verse 1]
The sun is shining bright today
We're walking down the street

[Chorus]
Oh, don't you let me go
Our love is a sweet melody

[Outro]
Fading out now...`}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Add lyrics with section markers like [Verse], [Chorus], [Bridge], [Outro]
          </p>
        </div>

        {/* Musical Parameters Section */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Musical Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BPM */}
            <div>
              <label className="block text-sm font-medium mb-2">BPM (Beats Per Minute)</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value === "" ? "" : Number(e.target.value))}
                min={60}
                max={200}
                step={1}
                placeholder="120"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Typical range: 60-200 BPM
              </p>
            </div>

            {/* Key */}
            <div>
              <label className="block text-sm font-medium mb-2">Musical Key</label>
              <div className="flex gap-2">
                <select
                  value={key.split(" ")[0] || ""}
                  onChange={(e) => {
                    const baseKey = e.target.value;
                    const keyType = key.includes("Major") ? " Major" : key.includes("Minor") ? " Minor" : "";
                    setKey(baseKey ? `${baseKey}${keyType}`.trim() : "");
                  }}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Key</option>
                  {keys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  value={key.includes("Major") ? "Major" : key.includes("Minor") ? "Minor" : ""}
                  onChange={(e) => {
                    const baseKey = key.split(" ")[0];
                    const keyType = e.target.value;
                    setKey(baseKey && keyType ? `${baseKey} ${keyType}` : baseKey || "");
                  }}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Type</option>
                  {keyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <div className="grid grid-cols-3 gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(mood === m ? "" : m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      mood === m
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Instrument Role</label>
              <div className="flex gap-2">
                {instrumentRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setInstrumentRole(instrumentRole === role ? "" : role)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      instrumentRole === role
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Music Length */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Music Length (ms)
          </label>
          <input
            type="number"
            value={musicLengthMs}
            onChange={(e) => setMusicLengthMs(Number(e.target.value))}
            min={3000}
            max={300000}
            step={1000}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Range: 3,000 ms (3 seconds) to 300,000 ms (5 minutes). Default: 30,000 ms (30 seconds)
          </p>
        </div>

        {/* Force Instrumental */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={forceInstrumental}
              onChange={(e) => setForceInstrumental(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600"></div>
            <span className="ml-3 text-sm font-medium">Force Instrumental</span>
          </label>
          <p className="text-xs text-gray-400">
            (Ensures the generated music is instrumental, no vocals)
          </p>
        </div>

        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium mb-2">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <optgroup label="MP3">
              <option value="mp3_22050_32">MP3 22.05kHz 32kbps</option>
              <option value="mp3_24000_48">MP3 24kHz 48kbps</option>
              <option value="mp3_44100_32">MP3 44.1kHz 32kbps</option>
              <option value="mp3_44100_64">MP3 44.1kHz 64kbps</option>
              <option value="mp3_44100_96">MP3 44.1kHz 96kbps</option>
              <option value="mp3_44100_128">MP3 44.1kHz 128kbps (Default)</option>
              <option value="mp3_44100_192">MP3 44.1kHz 192kbps</option>
            </optgroup>
            <optgroup label="PCM">
              <option value="pcm_8000">PCM 8kHz</option>
              <option value="pcm_16000">PCM 16kHz</option>
              <option value="pcm_22050">PCM 22.05kHz</option>
              <option value="pcm_24000">PCM 24kHz</option>
              <option value="pcm_32000">PCM 32kHz</option>
              <option value="pcm_44100">PCM 44.1kHz</option>
              <option value="pcm_48000">PCM 48kHz</option>
            </optgroup>
            <optgroup label="Opus">
              <option value="opus_48000_32">Opus 48kHz 32kbps</option>
              <option value="opus_48000_64">Opus 48kHz 64kbps</option>
              <option value="opus_48000_96">Opus 48kHz 96kbps</option>
              <option value="opus_48000_128">Opus 48kHz 128kbps</option>
              <option value="opus_48000_192">Opus 48kHz 192kbps</option>
            </optgroup>
            <optgroup label="Other">
              <option value="ulaw_8000">μ-law 8kHz</option>
              <option value="alaw_8000">A-law 8kHz</option>
            </optgroup>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Select the audio format for the generated music
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Generating Music..." : "Generate Music"}
        </button>

        {/* Progress Bar */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Generating your music...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              This may take a minute depending on the music length...
            </p>
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
