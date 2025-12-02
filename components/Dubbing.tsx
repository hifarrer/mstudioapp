"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";

interface DubbingStatus {
  dubbing_id: string;
  name?: string;
  status: string;
  target_languages?: string[];
  created_at?: string;
  editable?: boolean;
  media_metadata?: {
    content_type?: string;
    duration?: number;
  };
}

export default function Dubbing() {
  const [file, setFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [foregroundAudioFile, setForegroundAudioFile] = useState<File | null>(null);
  const [backgroundAudioFile, setBackgroundAudioFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [dubbingId, setDubbingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dubbingStatus, setDubbingStatus] = useState<DubbingStatus | null>(null);
  const [expectedDurationSec, setExpectedDurationSec] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const foregroundAudioInputRef = useRef<HTMLInputElement>(null);
  const backgroundAudioInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" },
    { code: "ru", name: "Russian" },
    { code: "nl", name: "Dutch" },
    { code: "cs", name: "Czech" },
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "hu", name: "Hungarian" },
    { code: "ko", name: "Korean" },
  ];

  const handleFileSelect = useCallback((selectedFile: File, type: "main" | "csv" | "foreground" | "background") => {
    if (type === "main") {
      setFile(selectedFile);
    } else if (type === "csv") {
      setCsvFile(selectedFile);
    } else if (type === "foreground") {
      setForegroundAudioFile(selectedFile);
    } else if (type === "background") {
      setBackgroundAudioFile(selectedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "main" | "csv" | "foreground" | "background") => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        if (type === "main" && (droppedFile.type.startsWith("audio/") || droppedFile.type.startsWith("video/"))) {
          handleFileSelect(droppedFile, type);
        } else if (type === "csv" && droppedFile.type === "text/csv") {
          handleFileSelect(droppedFile, type);
        } else if ((type === "foreground" || type === "background") && droppedFile.type.startsWith("audio/")) {
          handleFileSelect(droppedFile, type);
        }
      }
    },
    [handleFileSelect]
  );

  const checkDubbingStatus = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/dubbing?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to check dubbing status");
      }
      const data: DubbingStatus = await response.json();
      setDubbingStatus(data);
      
      if (data.status === "dubbed") {
        setIsPolling(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setIsLoading(false);
        // Note: The API response doesn't include the audio URL directly
        // You may need to fetch it separately or it might be in the response
      } else if (data.status === "failed" || data.status === "error") {
        setIsPolling(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setError("Dubbing failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Status check error:", err);
    }
  }, []);

  const startPolling = useCallback(
    async (id: string) => {
      setIsPolling(true);
      pollingIntervalRef.current = setInterval(async () => {
        await checkDubbingStatus(id);
      }, 5000); // Poll every 5 seconds
    },
    [checkDubbingStatus]
  );

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleDownload = async () => {
    if (!dubbingId || !dubbingStatus) {
      setError("No dubbing ID available");
      return;
    }

    // Get the first target language or use the selected target language
    const langToDownload = dubbingStatus.target_languages?.[0] || targetLang;

    try {
      const response = await fetch(`/api/dubbing/download?id=${dubbingId}&lang=${langToDownload}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Download failed" }));
        throw new Error(errorData.error || "Failed to download dubbing");
      }

      // Get the blob and create a download link
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `dubbed_audio_${dubbingId}_${langToDownload}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Set the audio URL for playback (keep the URL alive)
      setAudioUrl(url);
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during download");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Clean up old audio URL if it exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDubbingStatus(null);
    setExpectedDurationSec(null);

    if (!file) {
      setError("Please select an audio or video file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (csvFile) {
        formData.append("csv_file", csvFile);
      }
      if (foregroundAudioFile) {
        formData.append("foreground_audio_file", foregroundAudioFile);
      }
      if (backgroundAudioFile) {
        formData.append("background_audio_file", backgroundAudioFile);
      }
      formData.append("target_lang", targetLang);

      const response = await fetch("/api/dubbing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create dubbing");
      }

      const data = await response.json();
      const newDubbingId = data.dubbing_id;
      
      if (!newDubbingId) {
        throw new Error("No dubbing ID received from API");
      }

      // Store expected duration if provided
      if (data.expected_duration_sec) {
        setExpectedDurationSec(data.expected_duration_sec);
      }

      setDubbingId(newDubbingId);
      await startPolling(newDubbingId);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Dubbing</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Audio/Video File *</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "main")}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile, "main");
              }}
              className="hidden"
            />
            {file ? (
              <div>
                <p className="text-green-400">✓ {file.name}</p>
                <p className="text-sm text-gray-400 mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-2">Drag & drop audio/video file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* CSV File Upload (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">CSV File (Optional)</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "csv")}
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => csvFileInputRef.current?.click()}
          >
            <input
              ref={csvFileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile, "csv");
              }}
              className="hidden"
            />
            {csvFile ? (
              <div>
                <p className="text-green-400">✓ {csvFile.name}</p>
                <p className="text-sm text-gray-400 mt-2">Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-2">Drag & drop CSV file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Foreground Audio File (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Foreground Audio File (Optional)</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "foreground")}
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => foregroundAudioInputRef.current?.click()}
          >
            <input
              ref={foregroundAudioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile, "foreground");
              }}
              className="hidden"
            />
            {foregroundAudioFile ? (
              <div>
                <p className="text-green-400">✓ {foregroundAudioFile.name}</p>
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

        {/* Background Audio File (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Background Audio File (Optional)</label>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "background")}
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => backgroundAudioInputRef.current?.click()}
          >
            <input
              ref={backgroundAudioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile, "background");
              }}
              className="hidden"
            />
            {backgroundAudioFile ? (
              <div>
                <p className="text-green-400">✓ {backgroundAudioFile.name}</p>
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

        {/* Target Language */}
        <div>
          <label className="block text-sm font-medium mb-2">Target Language *</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Creating Dubbing..." : "Create Dubbing"}
        </button>

        {/* Loading State */}
        {isLoading && dubbingId && (
          <div className="text-center text-sm text-gray-400">
            <p>Dubbing ID: {dubbingId}</p>
            <p className="mt-2">Status: {dubbingStatus?.status || "processing"}</p>
            <p className="mt-1">Polling for results...</p>
            {expectedDurationSec && (
              <p className="mt-1">Expected duration: {expectedDurationSec}s</p>
            )}
          </div>
        )}

        {/* Dubbing Status */}
        {dubbingStatus && (
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Dubbing Status</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Status:</span> <span className="capitalize">{dubbingStatus.status}</span></p>
              {dubbingStatus.name && <p><span className="text-gray-400">Name:</span> {dubbingStatus.name}</p>}
              {dubbingStatus.target_languages && (
                <p><span className="text-gray-400">Target Languages:</span> {dubbingStatus.target_languages.join(", ")}</p>
              )}
              {dubbingStatus.media_metadata?.duration && (
                <p><span className="text-gray-400">Duration:</span> {dubbingStatus.media_metadata.duration}s</p>
              )}
              {dubbingStatus.created_at && (
                <p><span className="text-gray-400">Created:</span> {new Date(dubbingStatus.created_at).toLocaleString()}</p>
              )}
            </div>
            {/* Download Button */}
            {dubbingStatus.status === "dubbed" && (
              <button
                type="button"
                onClick={handleDownload}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Download Dubbed Audio
              </button>
            )}
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

