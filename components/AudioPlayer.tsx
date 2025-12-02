"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#3b82f6",
      progressColor: "#06b6d4",
      cursorColor: "#ffffff",
      barWidth: 2,
      barRadius: 3,
      height: 100,
      normalize: true,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("timeupdate", (time) => setCurrentTime(time));
    wavesurfer.on("ready", () => {
      setDuration(wavesurfer.getDuration());
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on("error", (error) => {
      console.error("WaveSurfer error:", error);
    });

    wavesurfer.load(audioUrl).catch((error) => {
      // Ignore abort errors during cleanup
      if (error.name !== "AbortError") {
        console.error("Error loading audio:", error);
      }
    });

    return () => {
      // Stop playback and pause before destroying
      try {
        if (wavesurfer) {
          // Check if wavesurfer has isDestroyed property
          if ('isDestroyed' in wavesurfer && (wavesurfer as any).isDestroyed) {
            return;
          }
          wavesurfer.pause();
          wavesurfer.destroy();
        }
      } catch (error) {
        // Ignore abort errors during cleanup - these are expected when component unmounts during loading
        if ((error as Error).name !== "AbortError") {
          console.error("Error destroying WaveSurfer:", error);
        }
      }
      wavesurferRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wavesurferRef.current || !waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    wavesurferRef.current.seekTo(percentage);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "generated-audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Generated Audio</h3>

      {/* Waveform */}
      <div
        ref={waveformRef}
        onClick={handleSeek}
        className="mb-4 cursor-pointer"
      />

      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={togglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4h4v12H6V4zm4 0h4v12h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 4l9 6-9 6V4z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.293 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.293l4.09-3.793a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
}

