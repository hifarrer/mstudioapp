"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function StemSeparation() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);
    setError(null);
    setDownloadUrl(null);
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
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [fileUrl, downloadUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDownloadUrl(null);

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/stem-separation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Get the zip file as a blob
      const zipBlob = await response.blob();
      const url = URL.createObjectURL(zipBlob);
      setDownloadUrl(url);
    } catch (err) {
      console.error("Stem separation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "stems.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">STEM Separation</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        Upload an audio file to separate it into individual stem sounds (vocals, drums, bass, etc.)
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
          {isLoading ? "Separating Stems..." : "Separate Stems"}
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-sm text-gray-400">
            <p>Processing audio file...</p>
            <p className="mt-2 text-xs">This may take a few moments</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Download Button */}
        {downloadUrl && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <p className="text-green-400 mb-3">✓ Stem separation complete!</p>
            <button
              type="button"
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Download ZIP File
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              The ZIP file contains individual stem audio files
            </p>
          </div>
        )}
      </form>
    </div>
  );
}




