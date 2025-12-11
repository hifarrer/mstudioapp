"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";

export default function ForcedAlignment() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
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
    setResult(null);

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    if (!text.trim()) {
      setError("Please enter the lyrics/text");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text);

      const response = await fetch("/api/forced-alignment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Forced alignment error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Forced Alignment</h2>

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

        {/* Text/Lyrics Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Text / Lyrics</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Enter the lyrics or text that matches the audio file..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter the lyrics or text that corresponds to the audio file
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !file || !text.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Processing..." : "Align Audio"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Alignment Result</h3>
            <pre className="text-sm text-gray-300 overflow-auto max-h-96 bg-gray-800 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Audio Player */}
        {fileUrl && <AudioPlayer audioUrl={fileUrl} />}
      </form>
    </div>
  );
}




